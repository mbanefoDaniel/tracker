import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRoute, generateTrackingCode } from "@/lib/routes";
import { initializePayment } from "@/lib/payment";
import type { PaymentType, PaymentMethod } from "@/lib/payment";

export async function GET() {
  const shipments = await prisma.shipment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      updates: {
        orderBy: { timestamp: "desc" },
        take: 1,
      },
    },
  });
  return NextResponse.json(shipments);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { origin, destination, receiverName, receiverPhone, senderName, senderPhone, packageDesc, packageWeight, priority, paymentType, amount, paymentMethod, paymentReference } = body;

  if (!origin || !destination || !receiverName) {
    return NextResponse.json(
      { error: "Origin, destination, and receiver name are required" },
      { status: 400 }
    );
  }

  const route = getRoute(origin, destination);
  if (!route) {
    return NextResponse.json(
      { error: `No route available from ${origin} to ${destination}` },
      { status: 400 }
    );
  }

  const payment = initializePayment(
    (paymentType as PaymentType) || "prepaid",
    Number(amount) || 0,
    (paymentMethod as PaymentMethod) || "cash",
    paymentReference || ""
  );

  let trackingCode = generateTrackingCode();
  // Ensure uniqueness
  let existing = await prisma.shipment.findUnique({
    where: { trackingCode },
  });
  while (existing) {
    trackingCode = generateTrackingCode();
    existing = await prisma.shipment.findUnique({
      where: { trackingCode },
    });
  }

  const shipment = await prisma.shipment.create({
    data: {
      trackingCode,
      origin,
      destination,
      receiverName,
      receiverPhone: receiverPhone || "",
      senderName: senderName || "",
      senderPhone: senderPhone || "",
      packageDesc: packageDesc || "",
      packageWeight: packageWeight || "",
      priority: priority || "standard",
      ...payment,
      route,
      currentStep: 0,
      currentStatus: "picked_up",
      updates: {
        create: {
          location: route[0],
          status: "picked_up",
          description: `Picked up at ${route[0]}`,
        },
      },
    },
    include: { updates: true },
  });

  return NextResponse.json(shipment, { status: 201 });
}
