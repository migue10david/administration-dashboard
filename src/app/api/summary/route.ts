import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth-credentials/auth";

async function getTransactionBehaviorLast7Days() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Obtener todas las transacciones de los últimos 7 días
  const [checkTransactions, wireTransfers] = await Promise.all([
    prisma.checkTransaction.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
        isActive: true
      },
      include: {
        checkTransactionType: true,
        customer: true
      }
    }),
    prisma.wireTransfer.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
        isActive: true
      },
      include: {
        customer: true,
        recipient: true,
        company: true
      }
    })
  ]);

  // Procesar los datos
  const result = {
    totalTransactions: checkTransactions.length + wireTransfers.length,
    totalAmount: {
      checks: checkTransactions.reduce((sum, t) => sum + t.amount, 0),
      wires: wireTransfers.reduce((sum, t) => sum + t.amount, 0),
      total: 0 // Se calculará abajo
    },
    transactionsByDay: {} as Record<string, {
      date: string;
      checks: number;
      wires: number;
      total: number;
      amountChecks: number;
      amountWires: number;
      totalAmount: number;
    }>,
    checkTypes: {} as Record<string, number>,
    mostActiveCustomers: {} as Record<string, number>,
    companiesInvolved: new Set<string>()
  };

  // Calcular total amount
  result.totalAmount.total = result.totalAmount.checks + result.totalAmount.wires;

  // Agrupar por día
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    result.transactionsByDay[dateStr] = {
      date: dateStr,
      checks: 0,
      wires: 0,
      total: 0,
      amountChecks: 0,
      amountWires: 0,
      totalAmount: 0
    };
  }

  // Procesar check transactions
  checkTransactions.forEach(transaction => {
    const dateStr = transaction.createdAt.toISOString().split('T')[0];
    if (result.transactionsByDay[dateStr]) {
      result.transactionsByDay[dateStr].checks++;
      result.transactionsByDay[dateStr].total++;
      result.transactionsByDay[dateStr].amountChecks += transaction.amount;
      result.transactionsByDay[dateStr].totalAmount += transaction.amount;
    }

    // Contar tipos de transacción de cheque
    const typeName = transaction.checkTransactionType.name;
    result.checkTypes[typeName] = (result.checkTypes[typeName] || 0) + 1;

    // Contar actividad de clientes
    const customerName = transaction.customer.firstName;
    result.mostActiveCustomers[customerName] = (result.mostActiveCustomers[customerName] || 0) + 1;
  });

  // Procesar wire transfers
  wireTransfers.forEach(transfer => {
    const dateStr = transfer.createdAt.toISOString().split('T')[0];
    if (result.transactionsByDay[dateStr]) {
      result.transactionsByDay[dateStr].wires++;
      result.transactionsByDay[dateStr].total++;
      result.transactionsByDay[dateStr].amountWires += transfer.amount;
      result.transactionsByDay[dateStr].totalAmount += transfer.amount;
    }

    // Contar actividad de clientes (emisores y receptores)
    const senderName = transfer.customer.firstName;
    const recipientName = transfer.recipient.firstName;
    result.mostActiveCustomers[senderName] = (result.mostActiveCustomers[senderName] || 0) + 1;
    result.mostActiveCustomers[recipientName] = (result.mostActiveCustomers[recipientName] || 0) + 1;

    // Registrar compañías involucradas
    if (transfer.company) {
      result.companiesInvolved.add(transfer.company.name);
    }
  });

  // Ordenar días (más reciente primero)
  const sortedDays = Object.values(result.transactionsByDay).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  result.transactionsByDay = sortedDays.reduce((acc, day) => {
    acc[day.date] = day;
    return acc;
  }, {} as Record<string, typeof sortedDays[0]>);

  return result;
}

// GET /api/summary  --> Obtener resumen
export async function GET() {
  const session = await auth();

  if (!session?.user?.id && session?.user?.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: "No autorizado" },
      { status: 401 }
    );
  }

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  try {
    const amountActiveCustomer = await prisma.customer.count({
      where: { isActive: true, type: "CUSTOMER" },
    });

    const amountActiveCustomerMonth = await prisma.customer.count({
      where: { 
        createdAt: {
          gte: firstDayOfMonth, // Mayor o igual al primer día del mes
          lte: now, // Menor o igual a la fecha actual
        },
        isActive: true, 
        type: "CUSTOMER" 
      },
    });


    const amountActiveRecipient = await prisma.customer.count({
      where: { isActive: true, type: "RECIPIENT" },
    });

    const amountActiveRecipientMonth = await prisma.customer.count({
      where: { 
        createdAt: {
          gte: firstDayOfMonth, // Mayor o igual al primer día del mes
          lte: now, // Menor o igual a la fecha actual
        },
        isActive: true, 
        type: "RECIPIENT" 
      },
    });

    // Cantidad de Transacciones de Cheques del Nes Actual
    const processedCheckTransactions = await prisma.checkTransaction.count({
      where: {
        createdAt: {
          gte: firstDayOfMonth, // Mayor o igual al primer día del mes
          lte: now, // Menor o igual a la fecha actual
        },
        isActive: true,
      },
    });

    // Cantidad de Tranferencias del Nes Actual
    const processedWireTransactions = await prisma.wireTransfer.count({
      where: {
        createdAt: {
          gte: firstDayOfMonth, // Mayor o igual al primer día del mes
          lte: now, // Menor o igual a la fecha actual
        },
        isActive: true,
      },
    });

    const processsPaymentMonth = processedCheckTransactions + processedWireTransactions;

    // Monto del mes actual por Pagos de Cheque
    const resultCheck = await prisma.checkTransaction.aggregate({
      where: {
        createdAt: {
          gte: firstDayOfMonth, // Fecha >= primer día del mes
          lte: now, // Fecha <= ahora
        },
        isActive: true, // Opcional: filtrar solo transacciones activas
      },
      _sum: {
        amount: true, // Suma del campo `amount`
      },
    });

    // Monto del mes actual por Pagos de Cheque
    const monthTotalPayCheck = resultCheck._sum.amount || 0;


    // Monto del mes actual por Transferencias
    const resultTansf = await prisma.wireTransfer.aggregate({
      where: {
        createdAt: {
          gte: firstDayOfMonth, // Fecha >= primer día del mes
          lte: now, // Fecha <= ahora
        },
        isActive: true, // Opcional: filtrar solo transacciones activas
      },
      _sum: {
        amount: true, // Suma del campo `amount`
      },
    });

    // Monto del mes actual por Transferencias
    const monthTotalPayTransf = resultTansf._sum.amount || 0;


    // Resultado 
    const monthTotalPay = monthTotalPayCheck + monthTotalPayTransf;

    const summary = await getTransactionBehaviorLast7Days();

    return NextResponse.json({
      activeCustomers: amountActiveCustomer,
      amountActiveCustomerMonth: amountActiveCustomerMonth,
      activeRecipients: amountActiveRecipient,
      amountActiveRecipientMonth: amountActiveRecipientMonth,
      processedCheckTransactions: processedCheckTransactions,
      processsPaymentMonth: processsPaymentMonth,
      processedWireTransactions: processedWireTransactions,
      monthTotalPay: monthTotalPay,
      monthTotalPayCheck: monthTotalPayCheck,
      monthTotalPayTransf: monthTotalPayTransf,
      summary: summary
    });
    
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al obtener la configuracion" },
      { status: 500 }
    );
  }
}
