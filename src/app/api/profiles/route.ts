import { NextResponse } from "next/server";
import { FilterQuery } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Profile } from "@/models/Profile";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get("limit") || "100");
  const skip = parseInt(url.searchParams.get("skip") || "0");
  const name = url.searchParams.get("name");
  const location = url.searchParams.get("location");
  const funding = url.searchParams.get("funding");

  const query: FilterQuery<typeof Profile> = {};

  if (name) query.name = { $regex: name, $options: "i" };
  if (location) query.location = { $regex: location, $options: "i" };
  if (funding) query['startup.funding'] = { $regex: funding, $options: "i" };

  try {
    await connectDB();

    // After scraping the profile data
    const profiles = await Profile.find(query)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .exec();

    return NextResponse.json({ data: profiles });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    const errorStack = error instanceof Error ? error.stack : "";

    console.error("Fetching error details:", {
      message: errorMessage,
      stack: errorStack,
    });

    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
