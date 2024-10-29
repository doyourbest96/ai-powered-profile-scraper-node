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
            <tr>
              <th className="p-4 font-semibold text-gray-600 uppercase">
                Name
              </th>
              <th className="p-4 font-semibold text-gray-600 uppercase">
                Location
              </th>
              <th className="p-4 font-semibold text-gray-600 uppercase">
                Funding Status
              </th>
              <th className="p-4 font-semibold text-gray-600 uppercase">
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
                  className="even:bg-blue-100 hover:bg-gray-300 hover:cursor-pointer"
                  onClick={handleOverview.bind(null, profile)}
                >
                  <td className="px-2 py-2 whitespace-nowrap">
                    {profile.name || "N/A"}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    {profile.location || "N/A"}
                  </td>
                  <td className="px-2 py-2 max-w-80 text-ellipsis overflow-hidden whitespace-nowrap">
                    {profile.startup?.funding || "N/A"}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    {profile.lastSeen || "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfileTable;
