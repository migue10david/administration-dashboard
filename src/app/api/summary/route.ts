import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth-credentials/auth";

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
      monthTotalPayTransf: monthTotalPayTransf
    });
    
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al obtener la configuracion" },
      { status: 500 }
    );
  }
}
