import React from "react";

const Pagination = ({ page, setPage, totalPages, pageSize, setPageSize }) => {
  const handlePageSizeChange = (e) => {
    const newPageSize = Number(e.target.value);
    setPageSize(newPageSize);
    setPage(1);
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const halfWay = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= halfWay + 1) {
        for (let i = 1; i <= maxPagesToShow; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (page >= totalPages - halfWay) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-3 py-2 border rounded disabled:opacity-50"
        >
          &lt;
        </button>
        {generatePageNumbers().map((p, index) => (
          <button
            key={index}
            onClick={() => typeof p === "number" && setPage(p)}
            className={`px-3 py-2 border rounded ${
              p === page ? "bg-blue-500 text-white" : ""
            }`}
            disabled={p === "..."}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-2 border rounded disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
      <div>
        <label htmlFor="pageSize" className="mr-2">
          Records on page:
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

export default Pagination;
