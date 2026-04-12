import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Tracking code is required" },
      { status: 400 }
    );
  }

  const shipment = await prisma.shipment.findUnique({
    where: { trackingCode: code.toUpperCase().trim() },
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
