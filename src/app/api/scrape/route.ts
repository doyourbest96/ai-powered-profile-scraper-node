import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import playwright from "playwright";

export async function POST(request: Request) {
  const { url } = await request.json();

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  // Validate URL format
  try {
    new URL(url);
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid URL format" + err },
      { status: 400 }
    );
  }

  try {
    let browser;
    if (!browser) {
      browser = await playwright.chromium.launch();
    }
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.route("**/*.{png,jpg,jpeg,gif,css}", (route) => route.abort());
    await page.route("**/*.{woff,woff2,ttf,otf}", (route) => route.abort());
    await page.route("**/{analytics,tracking,advertisement}/**", (route) =>
      route.abort()
    );

    // Set cookies before navigation
    await context.addCookies([
      {
        name: "_sso.key",
        value: "VwUqhHZdXDy7mhEE2GSiQNxL1AUv2SoK",
        domain: ".startupschool.org",
        path: "/",
      },
      {
        name: "_sus_session",
        value:
          "1f1kH3wqJ5QyBeAy2N92AQyPS4XuPShY%2FpkF225HgKdH2rQ5gUnlc%2FwwsBoiASsROZ1IHE73LMxuU%2F0aAFx3r5%2BXdVzOpVkOk0VU%2F6qg9fK6etpP3IJNf5WPQZ9wKxalxWKD0ZLT6qbayNiITsxpFvhFQ0uwB1s9lBb9AUKCHKas%2FzQTxNmptWj3KRN3WUnbX34la2F44fRZJcbspkSamN%2F8IH%2FlIqnrin7Mr1iRUc86PA2xGgED5TBK4GuG3yB3%2FPfs81ppIkNGFu1qr5dLeGiwTcY%3D--oIq4isnVCtAvM2Qr--Wn%2Fi3TBFAPdsc8Pv2mtLOg%3D%3D",
        domain: ".startupschool.org",
        path: "/",
      },
    ]);

    await page.goto(url);
    await page.waitForSelector(".css-139x40p");

    const content = await page.content();
    const $ = cheerio.load(content);

    const mainContent = $(".css-139x40p");
    // console.log("mainContent: ", mainContent);

    const profile = {
      userId: page.url().split("/").pop(),
      name: mainContent.find(".css-1s8r69b").text().trim(),
      location: mainContent.find('[title="Location"]').text().trim(),
      age: parseInt(
        mainContent.find('[title="Age"]').text().replace(/\D/g, "")
      ),
      lastSeen: mainContent
        .find('[title="Last seen on co-founder matching"]')
        .text()
        .replace("Last seen ", "")
        .trim(),
      avatar: mainContent.find(".css-1bm26bw").attr("src"),

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
        name: mainContent.find(".css-bcaew0 b").first().text().trim(),
        description: mainContent
          .find(
            `span.css-19yrmx8:contains("${mainContent
              .find(".css-bcaew0 b")
              .first()
              .text()
              .trim()}")`
          )
          .next(".css-1tp1ukf")
          .text()
          .trim(),
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
    };

    return NextResponse.json(profile);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    const errorStack = error instanceof Error ? error.stack : "";

    console.error("Scraping error details:", {
      message: errorMessage,
      stack: errorStack,
      url: url,
    });

    return NextResponse.json(
      { error: `Failed to scrape profile: ${errorMessage}` },
      { status: 500 }
    );
  }
}
