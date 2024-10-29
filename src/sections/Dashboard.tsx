"use client";
import React, { useCallback, useEffect } from "react";
import { ProfileModel, FilterModel } from "@/types";

const Dashboard = () => {
  // const [profile, setProfile] = React.useState<ProfileModel | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [profiles, setProfiles] = React.useState<ProfileModel[]>([]);
  const [filter, setFilter] = React.useState<FilterModel>({
    name: "",
    location: "",
    funding: "",
    skip: "0",
    limit: "100",
  });

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const filterParams = filter
        ? Object.entries(filter).reduce(
            (acc: Record<string, string>, [key, value]) => {
              if (value) {
                acc[key] = value.toString();
              }
              return acc;
            },
            {}
          )
        : {};

      const queryParams = new URLSearchParams({
        ...filterParams,
      }).toString();

      const response = await fetch(`/api/profiles?${queryParams}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setProfiles(data.data);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProfiles();
  };

  return (
    <>
      <div className="p-5 space-y-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                User Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={filter?.name}
                onChange={handleFilterChange}
                className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                value={filter?.location}
                onChange={handleFilterChange}
                className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter location"
              />
            </div>
            <div>
              <label
                htmlFor="startup"
                className="block text-sm font-medium text-gray-700"
              >
                Funding Status
              </label>
              <input
                type="text"
                name="funding"
                id="funding"
                value={filter?.funding}
                onChange={handleFilterChange}
                className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter funding"
              />
            </div>
          </div>
        </form>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Funding Status
                </th>
                <th className="py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  LinkedIn
                </th>
                <th className="py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Last Seen
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : (
                profiles.map((profile, index) => (
                  <tr
                    key={profile.userId || index}
                    className="even:bg-blue-100 hover:bg-gray-300"
                  >
                    <td className="whitespace-nowrap">
                      {profile.name || "N/A"}
                    </td>
                    <td className="whitespace-nowrap">
                      {profile.location || "N/A"}
                    </td>
                    <td className="max-w-80 text-ellipsis overflow-hidden whitespace-nowrap">
                      {profile.startup?.funding || "N/A"}
                    </td>
                    <td className="whitespace-nowrap">
                      {profile.linkedIn ? (
                        <a
                          href={profile.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View Profile
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="whitespace-nowrap">
                      {profile.lastSeen || "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
