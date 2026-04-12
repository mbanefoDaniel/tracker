import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { markPaidFields } from "@/lib/payment";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const shipment = await prisma.shipment.findUnique({ where: { id } });
  if (!shipment) {
    return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
  }

  if (shipment.paymentStatus === "paid") {
    return NextResponse.json(
      { error: "Shipment is already paid" },
      { status: 400 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const { paymentReference } = body as { paymentReference?: string };

  const updated = await prisma.shipment.update({
    where: { id },
    data: markPaidFields(paymentReference),
    include: { updates: { orderBy: { timestamp: "desc" } } },
  });

  return NextResponse.json(updated);
}
