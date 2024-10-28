"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaRegCopy } from "react-icons/fa6";
import { Profile } from "@/types/Profile";
import { toast } from "react-toastify";

const SITE_URL = "https://www.startupschool.org/cofounder-matching/candidate/";

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success("Link copied to clipboard");
};

export default function ProfileScraper() {
  const [url, setUrl] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScrape = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error("Failed to fetch profile");

      const data = await response.json();
      // console.log("data: ", data);
      setProfile(data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex gap-4 mb-8">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter Startup School profile URL"
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleScrape}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {loading ? "Loading..." : "Scrape Profile"}
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {profile && (
        <div className="bg-white rounded shadow p-6">
          <div className="flex items-center gap-6 mb-6">
            {profile.avatar && (
              <Image
                src={profile.avatar}
                alt={profile.name}
                width={160}
                height={160}
                className="rounded-full"
              />
            )}
            <div>
              <div className="flex flex-row gap-4">
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <button
                  className="p-1.5 text-xs rounded-md border text-white bg-blue-400 hover:bg-blue-500"
                  onClick={() => copyToClipboard(SITE_URL + profile.userId)}
                >
                  <FaRegCopy className="w-4 h-4" />
                </button>
              </div>
              <p>{profile.location}</p>
              <p>{profile.age} years old</p>
              <p>Last seen {profile.lastSeen}</p>
              <p>LinkedIn: {profile?.linkedIn}</p>
            </div>
          </div>

          <div className="grid gap-6">
            <section>
              <p>{profile.sumary}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">About Me</h2>
              <h3 className="font-semibold my-1">Intro</h3>
              <p>{profile.intro}</p>
              <h3 className="font-semibold my-1">Life Story</h3>
              <p>{profile.lifeStory}</p>
              <h3 className="font-semibold my-1">Free Time</h3>
              <p>{profile.freeTime}</p>
              <h3 className="font-semibold my-1">Other</h3>
              <p>{profile.other}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">My Background</h2>
              <h3 className="font-semibold my-1">Impressive accomplishment</h3>
              <p>{profile.accomplishments}</p>
              <h3 className="font-semibold my-1">Education</h3>
              <ul className="list-disc pl-5">
                {profile.education.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              <h3 className="font-semibold my-1">Employment</h3>
              <ul className="list-disc pl-5">
                {profile.employment.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">
                {profile.startup?.name}
              </h2>
              <h3 className="font-semibold my-1">{profile.startup?.name}</h3>
              <p>{profile.startup?.description}</p>
              <h3 className="font-semibold my-1">Progress</h3>
              <p>{profile.startup?.progress}</p>
              <h3 className="font-semibold my-1">Funding Status</h3>
              <p>{profile.startup?.funding}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">
                Co-founder Preferences
              </h2>
              <ul className="list-disc pl-5">
                {profile.cofounderPreferences?.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
              <h3 className="font-semibold my-1">Ideal co-founder</h3>
              <p>{profile.cofounderPreferences?.idealPersonality}</p>
              <h3 className="font-semibold my-1">Equity expectations</h3>
              <p>{profile.cofounderPreferences?.equity}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Interests</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold my-1">Shared</h3>
                  <ul className="list-disc pl-5">
                    {profile.interests?.shared.map((interest, i) => (
                      <li key={i}>{interest}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold my-1">Personal</h3>
                  <ul className="list-disc pl-5">
                    {profile.interests?.personal.map((interest, i) => (
                      <li key={i}>{interest}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
