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

  const route = shipment.route as string[];
  const nextStep = shipment.currentStep + 1;

  if (nextStep >= route.length) {
    return NextResponse.json(
      { error: "No more steps in route" },
      { status: 400 }
    );
  }

  const isLastStep = nextStep === route.length - 1;
  const newLocation = route[nextStep];
  let newStatus: string;
  let description: string;

  if (isLastStep) {
    newStatus = "arrived_destination";
    description = `Arrived at destination: ${newLocation}`;
  } else {
    newStatus = "in_transit";
    description = `Arrived at ${newLocation}`;
  }

  const updated = await prisma.shipment.update({
    where: { id },
    data: {
      currentStep: nextStep,
      currentStatus: newStatus,
      updates: {
        create: {
          location: newLocation,
          status: newStatus,
          description,
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
