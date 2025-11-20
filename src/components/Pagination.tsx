interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {

  // 페이지 버튼 범위 계산 (최대 5개만 표시)
  const getPageNumbers = () => {
    const range = 2; // 현재 페이지 기준으로 양쪽 2개씩 표시
    const start = Math.max(1, currentPage - range);
    const end = Math.min(totalPages, currentPage + range);

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="p-4 flex items-center justify-between text-gray-500">

      {/* 이전 버튼 */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        이전
      </button>

      {/* 페이지 번호 */}
      <div className="flex items-center gap-2 text-sm">

        {/* 처음 페이지로 */}
        {currentPage > 3 && (
          <>
            <button 
              onClick={() => onPageChange(1)}
              className="px-2 rounded-sm"
            >
              1
            </button>
            <span>...</span>
          </>
        )}

        {/* 중앙 페이지 목록 */}
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-2 rounded-sm ${
              page === currentPage ? "bg-lamaSky text-white" : ""
            }`}
          >
            {page}
          </button>
        ))}

        {/* 마지막 페이지로 */}
        {currentPage < totalPages - 2 && (
          <>
            <span>...</span>
            <button 
              onClick={() => onPageChange(totalPages)}
              className="px-2 rounded-sm"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* 다음 버튼 */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        다음
      </button>
    </div>
  );
};

export default Pagination;
