import { FilterModel } from "@/types";

const ProfileFilter = ({
  filter,
  handleChange,
}: {
  filter: FilterModel;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-row items-center gap-2">
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-nowrap text-gray-700"
          >
            User Name:
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={filter?.name}
            onChange={handleChange}
            className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter name"
          />
        </div>
        <div className="flex flex-row items-center gap-2">
          <label
            htmlFor="location"
            className="block text-sm font-semibold text-nowrap text-gray-700"
          >
            Location:
          </label>
          <input
            type="text"
            name="location"
            id="location"
            value={filter?.location}
            onChange={handleChange}
            className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter location"
          />
        </div>
        <div className="flex flex-row items-center gap-2">
          <label
            htmlFor="startup"
            className="block text-sm font-semibold text-nowrap text-gray-700"
          >
            Funding Status:
          </label>
          <input
            type="text"
            name="funding"
            id="funding"
            value={filter?.funding}
            onChange={handleChange}
            className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter funding"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileFilter;
