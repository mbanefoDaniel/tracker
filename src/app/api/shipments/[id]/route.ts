import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const shipment = await prisma.shipment.findUnique({
    where: { id },
    include: {
      updates: {
        orderBy: { timestamp: "desc" },
      },
    },
  });

  if (!shipment) {
    return NextResponse.json(
      { error: "Shipment not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(shipment);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { receiverName, receiverPhone, senderName, senderPhone, packageDesc, packageWeight, priority } = body;

  const shipment = await prisma.shipment.findUnique({ where: { id } });
  if (!shipment) {
    return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
  }

  const updated = await prisma.shipment.update({
    where: { id },
    data: {
      ...(receiverName !== undefined && { receiverName }),
      ...(receiverPhone !== undefined && { receiverPhone }),
      ...(senderName !== undefined && { senderName }),
      ...(senderPhone !== undefined && { senderPhone }),
      ...(packageDesc !== undefined && { packageDesc }),
      ...(packageWeight !== undefined && { packageWeight }),
      ...(priority !== undefined && { priority }),
    },
    include: { updates: { orderBy: { timestamp: "desc" } } },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const shipment = await prisma.shipment.findUnique({ where: { id } });
  if (!shipment) {
    return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
  }

  await prisma.shipment.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
