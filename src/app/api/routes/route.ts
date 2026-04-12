import { NextResponse } from "next/server";
import { getAvailableCities, ROUTES } from "@/lib/routes";

export async function GET() {
  const cities = getAvailableCities();
  const routes = Object.keys(ROUTES).map((key) => {
    const [origin, destination] = key.split("-");
    return { origin, destination, stops: ROUTES[key] };
  });
  return NextResponse.json({ cities, routes });
}
