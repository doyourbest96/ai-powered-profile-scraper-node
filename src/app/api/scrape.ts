import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

interface Product {
  title: string;
  price: string;
  imageUrl: string;
}

interface ScrapeRequest extends NextApiRequest {
  body: {
    url: string;
  };
}

export default async function handler(
  req: ScrapeRequest,
  res: NextApiResponse<Product[] | { error: string }>
) {
  if (req.method === "POST") {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "networkidle2" });

      const products = await page.evaluate(() => {
        const productElements = document.querySelectorAll(".product-item");
        return Array.from(productElements).map(
          (product): Product => ({
            title:
              (product.querySelector(".product-title") as HTMLElement)
                ?.textContent || "",
            price:
              (product.querySelector(".product-price") as HTMLElement)
                ?.textContent || "",
            imageUrl:
              (product.querySelector("img") as HTMLImageElement)?.src || "",
          })
        );
      });

      await browser.close();
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to scrape data" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
