import Link from "next/link";
import Image from "next/image";

const About = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="max-w-lg p-12 flex flex-col justify-center items-center gap-4 text-center">
        <h1 className="text-4xl font-semibold">Profile Scraper</h1>
        <p className="text-xl">Powered Profile Scraper by @Victor</p>
        <p className="text-lg">
          If you have any questions about this, please contact{" "}
          <strong>@doyourbest</strong> on Discord.
        </p>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/doyourbest96/next-scraper"
        >
          <Image
            src="/cutestar.png"
            alt="Logo"
            width={320}
            height={320}
            className="h-10 w-10 rounded-full"
          />
        </Link>
      </div>
    </div>
  );
};

export default About;
