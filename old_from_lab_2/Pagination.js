import React from "react";

const OldPagination = ({
  page,
  setPage,
  totalPages,
  pageSize,
  setPageSize,
}) => {
  const handlePageSizeChange = (e) => {
    const newPageSize = Number(e.target.value);
    setPageSize(newPageSize);
    setPage(1);
  };

  return (
    <div className="flex items-center justify-between mt-4">
      <div>
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Назад
        </button>
        <span className="mx-4">
          Страница {page} из {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Вперед
        </button>
      </div>
      <div>
        <label htmlFor="pageSize" className="mr-2">
          Записей на странице:
        </label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={handlePageSizeChange}
          className="px-2 py-1 border rounded"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
};

export default OldPagination;
