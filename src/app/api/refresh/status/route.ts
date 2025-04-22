import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Profile } from "@/models/Profile";

export async function GET() {
  try {
    await connectDB();

    // Get overall statistics
    const totalProfiles = await Profile.countDocuments();
    const neverRefreshed = await Profile.countDocuments({
      lastRefreshed: null,
    });
    const refreshedSuccessfully = await Profile.countDocuments({
      refreshStatus: "success",
    });
    const failedRefreshes = await Profile.countDocuments({
      refreshStatus: "failed",
    });
    const pendingRefreshes = await Profile.countDocuments({
      refreshStatus: "pending",
    });

    // Get refresh statistics by time periods
    const last24Hours = await Profile.countDocuments({
      lastRefreshed: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    const last7Days = await Profile.countDocuments({
      lastRefreshed: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });

    // Get most recent refreshes (both successful and failed)
    const recentRefreshes = await Profile.find({ lastRefreshed: { $ne: null } })
      .sort({ lastRefreshed: -1 })
      .limit(10)
      .select("userId name lastRefreshed refreshStatus refreshError")
      .lean();

    // Get profiles with most failed attempts
    const mostFailedAttempts = await Profile.find({ refreshStatus: "failed" })
      .sort({ refreshAttempts: -1 })
      .limit(10)
      .select("userId name refreshAttempts refreshError lastRefreshed")
      .lean();

    return NextResponse.json({
      totalProfiles,
      refreshStats: {
        neverRefreshed,
        refreshedSuccessfully,
        failedRefreshes,
        pendingRefreshes,
        last24Hours,
        last7Days,
      },
      recentRefreshes,
      mostFailedAttempts,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: `Failed to get refresh status: ${errorMessage}` },
      { status: 500 }
    );
  }
}
