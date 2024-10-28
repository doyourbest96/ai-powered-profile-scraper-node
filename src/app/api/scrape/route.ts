import { NextApiRequest, NextApiResponse } from "next";
import * as cheerio from "cheerio";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { url } = req.body;

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const profile = {
      name: $(".css-1s8r69b").text().trim(),
      location: $('[title="Location"]').text().trim(),
      age: parseInt($('[title="Age"]').text().replace(/\D/g, "")),
      lastSeen: $('[title="Last seen on co-founder matching"]')
        .text()
        .replace("Last seen ", "")
        .trim(),
      videoUrl: $(".css-1r34zfs a").attr("href"),
      avatar: $(".css-1bm26bw").attr("src"),

      intro: $('span.css-19yrmx8:contains("Intro")')
        .next(".css-1tp1ukf")
        .text()
        .trim(),
      lifeStory: $('span.css-19yrmx8:contains("Life Story")')
        .next(".css-1tp1ukf")
        .text()
        .trim(),
      freeTime: $('span.css-19yrmx8:contains("Free Time")')
        .next(".css-1tp1ukf")
        .text()
        .trim(),
      other: $('span.css-19yrmx8:contains("Other")')
        .next(".css-1tp1ukf")
        .text()
        .trim(),

      accomplishments: $(
        'span.css-19yrmx8:contains("Impressive accomplishment")'
      )
        .next(".css-1tp1ukf")
        .text()
        .trim(),

      education: $('.css-19yrmx8:contains("Education")')
        .next(".css-1tp1ukf")
        .find(".css-kaq1dv")
        .map((_, el) => $(el).text().trim())
        .get(),

      employment: $('.css-19yrmx8:contains("Employment")')
        .next(".css-1tp1ukf")
        .find(".css-kaq1dv")
        .map((_, el) => {
          const text = $(el).text();
          const [company, role, period] = text
            .split(",")
            .map((part) => part.trim());
          return { company, role, period };
        })
        .get(),

      startup: {
        name: $(".css-bcaew0 b").first().text().trim(),
        description: $('span.css-19yrmx8:contains("military extension")')
          .next(".css-1tp1ukf")
          .text()
          .trim(),
        progress: $('span.css-19yrmx8:contains("Progress")')
          .next(".css-1tp1ukf")
          .text()
          .trim(),
        funding: $('span.css-19yrmx8:contains("Funding Status")')
          .next(".css-1tp1ukf")
          .text()
          .trim(),
      },

      cofounderPreferences: {
        requirements: $(".css-1hla380 p")
          .map((_, el) => $(el).text().trim())
          .get(),
        idealPersonality: $('span.css-19yrmx8:contains("Ideal co-founder")')
          .next(".css-1tp1ukf")
          .text()
          .trim(),
        equity: $('span.css-19yrmx8:contains("Equity expectations")')
          .next(".css-1tp1ukf")
          .text()
          .trim(),
      },

      interests: {
        shared: $(".css-1v9f1hn")
          .map((_, el) => $(el).text().trim())
          .get(),
        personal: $(".css-1lw35t7")
          .map((_, el) => $(el).text().trim())
          .get(),
      },

      linkedIn: $(".css-107cmgv").attr("title"),
    };

    return res.status(200).json(profile);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to scrape profile" + error });
  }
}
