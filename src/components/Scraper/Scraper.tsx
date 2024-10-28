"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Profile } from "@/types/Profile";

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
                width={100}
                height={100}
                className="rounded-full"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p>{profile.location}</p>
              <p>{profile.age} years old</p>
              <p>Last seen {profile.lastSeen}</p>
            </div>
          </div>

          <div className="grid gap-6">
            <section>
              <h2 className="text-xl font-semibold mb-2">About</h2>
              <p>{profile.intro}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Startup</h2>
              <h3>{profile.startup.name}</h3>
              <p>{profile.startup.description}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">
                Co-founder Preferences
              </h2>
              <ul className="list-disc pl-5">
                {profile.cofounderPreferences.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Interests</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Shared</h3>
                  <ul className="list-disc pl-5">
                    {profile.interests.shared.map((interest, i) => (
                      <li key={i}>{interest}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium">Personal</h3>
                  <ul className="list-disc pl-5">
                    {profile.interests.personal.map((interest, i) => (
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
