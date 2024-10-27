import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { url } = await request.json();

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  return NextResponse.json([
    {
      title: "Nike Air Max 270",
      price: "$150",
      imageUrl: "/nike-air-max.jpg",
    },
    {
      title: "Adidas Ultra Boost",
      price: "$180",
      imageUrl: "/adidas-boost.jpg",
    },
  ]);
}
