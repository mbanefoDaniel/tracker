import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Shipment, TrackingUpdate } from "@prisma/client";

type ShipmentWithUpdates = Shipment & { updates: TrackingUpdate[] };

export async function GET() {
  const shipments: ShipmentWithUpdates[] = await prisma.shipment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      updates: {
        orderBy: { timestamp: "desc" },
        take: 1,
      },
    },
  });

  const headers = [
    "Tracking Code",
    "Origin",
    "Destination",
    "Receiver Name",
    "Receiver Phone",
    "Sender Name",
    "Sender Phone",
    "Package Description",
    "Package Weight",
    "Priority",
    "Status",
    "Current Location",
    "Created At",
  ];

  const escapeCSV = (val: string) => {
    if (val.includes(",") || val.includes('"') || val.includes("\n")) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const rows = shipments.map((s) => [
    s.trackingCode,
    s.origin,
    s.destination,
    s.receiverName,
    s.receiverPhone,
    s.senderName,
    s.senderPhone,
    s.packageDesc,
    s.packageWeight,
    s.priority,
    s.currentStatus,
    s.updates[0]?.location || "",
    new Date(s.createdAt).toISOString(),
  ]);

  const csv =
    headers.map(escapeCSV).join(",") +
    "\n" +
    rows.map((row) => row.map(escapeCSV).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="shipments-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
