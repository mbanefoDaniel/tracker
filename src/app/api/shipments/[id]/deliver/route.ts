import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const shipment = await prisma.shipment.findUnique({
    where: { id },
  });

  if (!shipment) {
    return NextResponse.json(
      { error: "Shipment not found" },
      { status: 404 }
    );
  }

  if (shipment.currentStatus === "delivered") {
    return NextResponse.json(
      { error: "Shipment already delivered" },
      { status: 400 }
    );
  }

  if (shipment.deliveryLocked) {
    return NextResponse.json(
      { error: "Delivery is locked — payment is required before delivery" },
      { status: 403 }
    );
  }

  const route = shipment.route as string[];
  const finalLocation = route[route.length - 1];

  const updated = await prisma.shipment.update({
    where: { id },
    data: {
      currentStep: route.length - 1,
      currentStatus: "delivered",
      updates: {
        create: {
          location: finalLocation,
          status: "delivered",
          description: `Delivered at ${finalLocation}`,
        },
      },
    },
    include: {
      updates: {
        orderBy: { timestamp: "desc" },
      },
    },
  });

  return NextResponse.json(updated);
}
