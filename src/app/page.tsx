import Head from "next/head";
import Scraper from "../components/Scraper/Scraper";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Web Scraper</title>
        <meta name="description" content="Scrape product data easily" />
      </Head>

      <main>
        <Scraper />
      </main>
    </div>
  );
}
