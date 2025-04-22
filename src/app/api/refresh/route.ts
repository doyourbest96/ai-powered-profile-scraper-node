import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import playwright from "playwright";
import { connectDB } from "@/lib/mongodb";
import { Profile } from "@/models/Profile";

// Helper function to delay execution
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(request: Request) {
  try {
    // Connect to database
    await connectDB();

    // Parse query parameters
    const url = new URL(request.url);
    const batchSize = parseInt(url.searchParams.get("batchSize") || "100");
    const userId = url.searchParams.get("userId"); // Optional: refresh specific profile

    // Get authentication from environment variables
    const baseUrl = process.env.NEXT_PUBLIC_FETCH_URL;
    const ssoKey = process.env.NEXT_PUBLIC_SSO_KEY;
    const susSession = process.env.NEXT_PUBLIC_SUS_SESSION;

    // Validate required environment variables
    if (!baseUrl || !ssoKey || !susSession) {
      return NextResponse.json(
        {
          error: "Missing required environment variables",
        },
        { status: 400 }
      );
    }

    // Build query for profiles to refresh
    const query: Record<string, unknown> = {};

    // If userId is provided, refresh only that specific profile
    if (userId) {
      query.userId = userId;
    } else {
      // Otherwise, prioritize profiles that:
      // 1. Have never been refreshed (lastRefreshed is null)
      // 2. Have failed refreshes but fewer than 3 attempts
      // 3. Were refreshed longest time ago
      query.$or = [
        { lastRefreshed: null },
        { refreshStatus: "failed", refreshAttempts: { $lt: 3 } },
      ];
    }

    // Get profiles to refresh
    const profilesToRefresh = await Profile.find(query)
      .sort({ lastRefreshed: 1 }) // Oldest first
      .limit(batchSize)
      .lean();

    if (profilesToRefresh.length === 0) {
      return NextResponse.json({ message: "No profiles to refresh" });
    }

    // Mark selected profiles as pending refresh
    const profileIds = profilesToRefresh.map((profile) => profile.userId);
    await Profile.updateMany(
      { userId: { $in: profileIds } },
      {
        refreshStatus: "pending",
        $inc: { refreshAttempts: 1 },
      }
    );

    // Launch browser once for all profiles
    const browser = await playwright.chromium.launch();
    const context = await browser.newContext({
      ignoreHTTPSErrors: true,
      extraHTTPHeaders: {
        "Accept-Encoding": "gzip, deflate, br",
      },
    });

    // Set cookies for authentication
    await context.addCookies([
      {
        name: "_sso.key",
        value: ssoKey,
        domain: ".startupschool.org",
        path: "/",
      },
      {
        name: "_sus_session",
        value: susSession,
        domain: ".startupschool.org",
        path: "/",
      },
    ]);

    // Configure page to block unnecessary resources
    const page = await context.newPage();
    await page.route("**/*.{png,jpg,jpeg,gif,css}", (route) => route.abort());
    await page.route("**/*.{woff,woff2,ttf,otf}", (route) => route.abort());
    await page.route("**/{analytics,tracking,advertisement}/**", (route) =>
      route.abort()
    );

    // Process each profile
    const results = {
      total: profilesToRefresh.length,
      updated: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const profile of profilesToRefresh) {
      try {
        // Construct the profile URL
        const profileUrl = `${baseUrl}/${profile.userId}`;

        // Navigate to the profile page
        await page.goto(profileUrl, {
          waitUntil: "domcontentloaded",
          timeout: 30000,
        });

        // Wait for the main content to load
        await page.waitForSelector(".css-139x40p");

        // Get the page content
        const content = await page.content();
        const $ = cheerio.load(content);

        const mainContent = $(".css-139x40p");
        const age = mainContent.find('[title="Age"]').text().replace(/\D/g, "");

        // Extract profile data
        const updatedProfile = {
          userId: profile.userId,
          name: mainContent.find(".css-1s8r69b").text().trim(),
          location: mainContent.find('[title="Location"]').text().trim(),
          age: age ? parseInt(age) : null,
          lastSeen: mainContent
            .find('[title="Last seen on co-founder matching"]')
            .text()
            .replace("Last seen ", "")
            .trim(),
          avatar: mainContent.find(".css-1bm26bw").attr("src"),
          sumary: mainContent.find(".css-cyoc3t").text().trim(),
          intro: mainContent
            .find('span.css-19yrmx8:contains("Intro")')
            .next(".css-1tp1ukf")
            .text()
            .trim(),
          lifeStory: mainContent
            .find('span.css-19yrmx8:contains("Life Story")')
            .next(".css-1tp1ukf")
            .text()
            .trim(),
          freeTime: mainContent
            .find('span.css-19yrmx8:contains("Free Time")')
            .next(".css-1tp1ukf")
            .text()
            .trim(),
          other: mainContent
            .find('span.css-19yrmx8:contains("Other")')
            .next(".css-1tp1ukf")
            .text()
            .trim(),
          accomplishments: mainContent
            .find('span.css-19yrmx8:contains("Impressive accomplishment")')
            .next(".css-1tp1ukf")
            .text()
            .trim(),
          education: mainContent
            .find('.css-19yrmx8:contains("Education")')
            .next(".css-1tp1ukf")
            .find(".css-kaq1dv")
            .map((_, el) => $(el).text().trim())
            .get(),
          employment: mainContent
            .find('.css-19yrmx8:contains("Employment")')
            .next(".css-1tp1ukf")
            .find(".css-kaq1dv")
            .map((_, el) => $(el).text().trim())
            .get(),
          startup: {
            name:
              mainContent.find(".css-bcaew0 b").first().text().trim() !== ""
                ? mainContent.find(".css-bcaew0 b").first().text().trim()
                : "Potential Idea",
            description:
              mainContent.find(".css-bcaew0 b").first().text().trim() !== ""
                ? mainContent
                    .find(
                      `span.css-19yrmx8:contains("${mainContent
                        .find(".css-bcaew0 b")
                        .first()
                        .text()
                        .trim()}")`
                    )
                    .next(".css-1tp1ukf")
                    .text()
                    .trim()
                : mainContent.find("div.css-1hla380").text().trim(),
            progress: mainContent
              .find('span.css-19yrmx8:contains("Progress")')
              .next(".css-1tp1ukf")
              .text()
              .trim(),
            funding: mainContent
              .find('span.css-19yrmx8:contains("Funding Status")')
              .next(".css-1tp1ukf")
              .text()
              .trim(),
          },
          cofounderPreferences: {
            requirements: mainContent
              .find(".css-1hla380 p")
              .map((_, el) => $(el).text().trim())
              .get(),
            idealPersonality: mainContent
              .find('span.css-19yrmx8:contains("Ideal co-founder")')
              .next(".css-1tp1ukf")
              .text()
              .trim(),
            equity: mainContent
              .find('span.css-19yrmx8:contains("Equity expectations")')
              .next(".css-1tp1ukf")
              .text()
              .trim(),
          },
          interests: {
            shared: mainContent
              .find(".css-1v9f1hn")
              .map((_, el) => $(el).text().trim())
              .get(),
            personal: mainContent
              .find(".css-1lw35t7")
              .map((_, el) => $(el).text().trim())
              .get(),
          },
          linkedIn: mainContent.find(".css-107cmgv").attr("title"),
          lastRefreshed: new Date(),
          refreshStatus: "success",
          refreshError: null,
          updatedAt: new Date(),
        };

        // Update the profile in the database
        await Profile.findOneAndUpdate(
          { userId: profile.userId },
          updatedProfile,
          { new: true }
        );

        results.updated++;

        // Add a small delay to avoid rate limiting
        await delay(1000);
      } catch (error) {
        results.failed++;
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        results.errors.push(
          `Error updating ${profile.userId}: ${errorMessage}`
        );

        // Update profile with error status
        await Profile.findOneAndUpdate(
          { userId: profile.userId },
          {
            refreshStatus: "failed",
            refreshError: errorMessage,
            lastRefreshed: new Date(),
          }
        );

        console.error(`Error updating profile ${profile.userId}:`, error);
      }
    }

    // Close browser
    await browser.close();

    return NextResponse.json({
      message: "Profile refresh completed",
      results,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Profile refresh error:", errorMessage);

    return NextResponse.json(
      { error: `Failed to refresh profiles: ${errorMessage}` },
      { status: 500 }
    );
  }
}
