export type RouteKey = string;

export const ROUTES: Record<RouteKey, string[]> = {
  "Lagos-Abuja": ["Lagos", "Ibadan", "Ilorin", "Abuja"],
  "Abuja-Lagos": ["Abuja", "Lokoja", "Ibadan", "Lagos"],
  "Lagos-Port Harcourt": ["Lagos", "Benin City", "Warri", "Port Harcourt"],
  "Port Harcourt-Lagos": ["Port Harcourt", "Warri", "Benin City", "Lagos"],
  "Abuja-Port Harcourt": ["Abuja", "Lokoja", "Benin City", "Port Harcourt"],
  "Port Harcourt-Abuja": ["Port Harcourt", "Benin City", "Lokoja", "Abuja"],
};

export function getRoute(origin: string, destination: string): string[] | null {
  const key = `${origin}-${destination}`;
  return ROUTES[key] ?? null;
}

export function getAvailableCities(): string[] {
  const cities = new Set<string>();
  Object.values(ROUTES).forEach((route) =>
    route.forEach((city) => cities.add(city))
  );
  return Array.from(cities).sort();
}

export function generateTrackingCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "NEFO";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function getStatusPercentage(status: string): number {
  switch (status) {
    case "picked_up":
      return 20;
    case "in_transit":
      return 50;
    case "arrived_destination":
      return 80;
    case "delivered":
      return 100;
    default:
      return 0;
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case "picked_up":
      return "Picked Up";
    case "in_transit":
      return "In Transit";
    case "arrived_destination":
      return "Arrived at Destination";
    case "delivered":
      return "Delivered";
    default:
      return status;
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "picked_up":
      return "bg-slate-800 text-white";
    case "in_transit":
      return "bg-orange-500 text-white";
    case "arrived_destination":
      return "bg-slate-600 text-white";
    case "delivered":
      return "bg-emerald-600 text-white";
    default:
      return "bg-gray-400 text-white";
  }
}

export function estimateDeliveryDate(
  createdAt: Date,
  routeLength: number
): Date {
  const hoursPerStop = 6;
  const totalHours = routeLength * hoursPerStop;
  const delivery = new Date(createdAt);
  delivery.setHours(delivery.getHours() + totalHours);
  return delivery;
}
