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
    const amountActiveRecipient = await prisma.customer.count({
      where: { isActive: true, type: "RECIPIENT" },
    });

    const processedCheckTransactions = await prisma.checkTransaction.count({
      where: {
        createdAt: {
          gte: firstDayOfMonth, // Mayor o igual al primer día del mes
          lte: now, // Menor o igual a la fecha actual
        },
        isActive: true,
      },
    });

    const processedWireTransactions = await prisma.wireTransfer.count({
      where: {
        createdAt: {
          gte: firstDayOfMonth, // Mayor o igual al primer día del mes
          lte: now, // Menor o igual a la fecha actual
        },
        isActive: true,
      },
    });


    return NextResponse.json({"activeCustomers": amountActiveCustomer, "activeRecipients": amountActiveRecipient, "processedCheckTransactions": processedCheckTransactions, "processedWireTransactions": processedWireTransactions});
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al obtener la configuracion" },
      { status: 500 }
    );
  }
}
