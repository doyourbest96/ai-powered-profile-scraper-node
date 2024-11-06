import Image from "next/image";
import { ProfileModel } from "@/types";

const ProfileTable = ({
  loading,
  profiles,
  handleOverview,
}: {
  loading: boolean;
  profiles: ProfileModel[];
  handleOverview: (profile: ProfileModel) => void;
}) => {
  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        <table className="min-w-full divide-y divide-gray-200 relative">
          <thead className="text-left bg-gray-50 sticky top-0 z-10">
            <tr className="font-semibold text-gray-600 uppercase">
              <th className="p-4"></th>
              <th className="p-4">Name</th>
              <th className="p-4">Location</th>
              <th className="p-4">Funding Status</th>
              <th className="p-4">Last Seen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading
              ? Array(5)
                  .fill(null)
                  .map((_, index) => (
                    <tr key={`loading-${index}`}>
                      <td colSpan={5} className="text-center p-4">
                        <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
                      </td>
                    </tr>
                  ))
              : profiles.map((profile, index) => (
                  <tr
                    key={profile.userId || index}
                    className="even:bg-blue-100 hover:bg-gray-300 hover:cursor-pointer"
                    onClick={handleOverview.bind(null, profile)}
                  >
                    <td className="p-2">
                      <Image
                        src={profile.avatar || "/cutestar.png"} // Use a static fallback image
                        alt="Profile"
                        width={36}
                        height={36}
                        className="rounded-full"
                      />
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      {profile.name || "N/A"}
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      {profile.location || "N/A"}
                    </td>
                    <td className="p-2 max-w-80 text-ellipsis overflow-hidden whitespace-nowrap">
                      {profile.startup?.funding || "N/A"}
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      {profile.lastSeen ? profile.lastSeen : "N/A"}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfileTable;
