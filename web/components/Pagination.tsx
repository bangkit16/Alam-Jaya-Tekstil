"use client";

interface PaginationProps {
  meta: {
    totalData: number;
    totalPages: number;
    currentPage: number;
    nextPage: number | null;
    prevPage: number | null;
  };
  onPageChange: (page: number) => void;
}

export default function Pagination({ meta, onPageChange }: PaginationProps) {
  const { totalPages, currentPage, nextPage, prevPage } = meta;

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        onClick={() => prevPage && onPageChange(prevPage)}
        disabled={!prevPage}
        className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>

      {Array.from({ length: totalPages }).map((_, index) => {
        const page = index + 1;

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-lg text-sm ${
              currentPage === page
                ? "bg-orange-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => nextPage && onPageChange(nextPage)}
        disabled={!nextPage}
        className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
