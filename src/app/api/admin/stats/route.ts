import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [total, pickedUp, inTransit, delivered, recentActivity] =
    await Promise.all([
      prisma.shipment.count(),
      prisma.shipment.count({ where: { currentStatus: "picked_up" } }),
      prisma.shipment.count({ where: { currentStatus: "in_transit" } }),
      prisma.shipment.count({ where: { currentStatus: "delivered" } }),
      prisma.trackingUpdate.findMany({
        orderBy: { timestamp: "desc" },
        take: 20,
        include: {
          shipment: {
            select: { trackingCode: true, receiverName: true },
          },
        },
      }),
    ]);

  const express = await prisma.shipment.count({
    where: { priority: "express" },
  });

  return NextResponse.json({
    total,
    pickedUp,
    inTransit,
    delivered,
    express,
    recentActivity,
  });
}
