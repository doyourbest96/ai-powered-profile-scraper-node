const ProfileFooter = ({
  total,
  matched,
  curPage,
  limit,
  setLimit,
  setCurPage,
}: {
  total: number;
  matched: number;
  curPage: number;
  limit: number;
  setLimit: (limit: number) => void;
  setCurPage: (page: number) => void;
}) => {
  const limitOptions = [10, 20, 50, 100];

  return (
    <div className="flex flex-row justify-between items-center">
      <span>Total Count: {total + " / Matched Count: " + matched}</span>
      <div className="flex flex-row gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Items per page:</label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {limitOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setCurPage(curPage - 1)}
          disabled={curPage === 1}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="flex items-center justify-center">
          {curPage + " / " + Math.ceil(matched / limit)}
        </span>
        <button
          onClick={() => setCurPage(curPage + 1)}
          disabled={curPage === Math.ceil(matched / limit)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProfileFooter;
