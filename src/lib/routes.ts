export type RouteKey = string;

export const ROUTES: Record<RouteKey, string[]> = {
  "New York, NY-Los Angeles, CA": ["New York, NY", "Philadelphia, PA", "Columbus, OH", "Indianapolis, IN", "Kansas City, MO", "Denver, CO", "Las Vegas, NV", "Los Angeles, CA"],
  "Los Angeles, CA-New York, NY": ["Los Angeles, CA", "Las Vegas, NV", "Denver, CO", "Kansas City, MO", "Indianapolis, IN", "Columbus, OH", "Philadelphia, PA", "New York, NY"],
  "New York, NY-Chicago, IL": ["New York, NY", "Philadelphia, PA", "Pittsburgh, PA", "Columbus, OH", "Chicago, IL"],
  "Chicago, IL-New York, NY": ["Chicago, IL", "Columbus, OH", "Pittsburgh, PA", "Philadelphia, PA", "New York, NY"],
  "New York, NY-Miami, FL": ["New York, NY", "Washington, DC", "Charlotte, NC", "Jacksonville, FL", "Miami, FL"],
  "Miami, FL-New York, NY": ["Miami, FL", "Jacksonville, FL", "Charlotte, NC", "Washington, DC", "New York, NY"],
  "Los Angeles, CA-Chicago, IL": ["Los Angeles, CA", "Phoenix, AZ", "Albuquerque, NM", "Dallas, TX", "Memphis, TN", "Chicago, IL"],
  "Chicago, IL-Los Angeles, CA": ["Chicago, IL", "Memphis, TN", "Dallas, TX", "Albuquerque, NM", "Phoenix, AZ", "Los Angeles, CA"],
  "Chicago, IL-Miami, FL": ["Chicago, IL", "Indianapolis, IN", "Nashville, TN", "Atlanta, GA", "Miami, FL"],
  "Miami, FL-Chicago, IL": ["Miami, FL", "Atlanta, GA", "Nashville, TN", "Indianapolis, IN", "Chicago, IL"],
  "Los Angeles, CA-Miami, FL": ["Los Angeles, CA", "Phoenix, AZ", "Dallas, TX", "Houston, TX", "New Orleans, LA", "Miami, FL"],
  "Miami, FL-Los Angeles, CA": ["Miami, FL", "New Orleans, LA", "Houston, TX", "Dallas, TX", "Phoenix, AZ", "Los Angeles, CA"],
  "New York, NY-Houston, TX": ["New York, NY", "Washington, DC", "Charlotte, NC", "Atlanta, GA", "Houston, TX"],
  "Houston, TX-New York, NY": ["Houston, TX", "Atlanta, GA", "Charlotte, NC", "Washington, DC", "New York, NY"],
  "Chicago, IL-Houston, TX": ["Chicago, IL", "Memphis, TN", "Dallas, TX", "Houston, TX"],
  "Houston, TX-Chicago, IL": ["Houston, TX", "Dallas, TX", "Memphis, TN", "Chicago, IL"],
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
