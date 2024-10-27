"use client";
import Image from "next/image";
import { useState } from "react";

interface Product {
  title: string;
  price: string;
  imageUrl: string;
}

const Scraper: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string>("");

  const handleScrape = async (): Promise<void> => {
    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data: Product[] = await response.json();
      setProducts(data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <div>
      <h1>Product Scraper</h1>
      <input
        type="text"
        value={url}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setUrl(e.target.value)
        }
        placeholder="Enter product page URL"
      />
      <button onClick={handleScrape}>Scrape Products</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {products.map((product, index) => (
          <li key={index}>
            <h2>{product.title}</h2>
            <p>{product.price}</p>
            <Image src={product.imageUrl} alt={product.title} width={100} height={100} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Scraper;
