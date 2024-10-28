import Head from "next/head";
import Scraper from "../components/Scraper/Scraper";
import { ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Web Scraper</title>
        <meta name="description" content="Scrape product data easily" />
      </Head>

      <main>
        <Scraper />
        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme="light"
        />
      </main>
    </div>
  );
}
