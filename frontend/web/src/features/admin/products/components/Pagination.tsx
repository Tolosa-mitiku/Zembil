import { motion } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  pageSizeOptions?: number[];
}

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  pageSizeOptions = [12, 24, 48, 96]
}: PaginationProps) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 
                  bg-white border border-grey-200 rounded-lg p-4">
      {/* Items Info & Per Page Selector */}
      <div className="flex items-center gap-4">
        <p className="text-body-small text-grey-600">
          Showing <span className="font-semibold text-grey-900">{startItem}</span> to{' '}
          <span className="font-semibold text-grey-900">{endItem}</span> of{' '}
          <span className="font-semibold text-grey-900">{totalItems}</span> products
        </p>

        {onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <span className="text-body-small text-grey-600 hidden sm:inline">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="px-3 py-1.5 text-body-small border border-grey-200 rounded-lg 
                       text-grey-900 focus:border-gold focus:ring-2 focus:ring-gold/20 
                       outline-none transition-all"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Page Navigation */}
      <div className="flex items-center gap-1">
        {/* First Page */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handlePageClick(1)}
          disabled={currentPage === 1}
          className={clsx(
            'p-2 rounded-lg transition-all',
            currentPage === 1
              ? 'text-grey-400 cursor-not-allowed'
              : 'text-grey-600 hover:bg-grey-100 hover:text-grey-900'
          )}
          title="First page"
        >
          <ChevronDoubleLeftIcon className="w-4 h-4" />
        </motion.button>

        {/* Previous Page */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className={clsx(
            'flex items-center gap-1 px-3 py-2 rounded-lg transition-all',
            currentPage === 1
              ? 'text-grey-400 cursor-not-allowed'
              : 'text-grey-600 hover:bg-grey-100 hover:text-grey-900'
          )}
          title="Previous page"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          <span className="text-label-medium hidden sm:inline">Previous</span>
        </motion.button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-grey-600"
                >
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <motion.button
                key={pageNum}
                whileHover={{ scale: isActive ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageClick(pageNum)}
                className={clsx(
                  'min-w-[40px] px-3 py-2 rounded-lg text-label-medium font-medium transition-all',
                  isActive
                    ? 'bg-gold text-white shadow-md'
                    : 'text-grey-700 hover:bg-grey-100'
                )}
              >
                {pageNum}
              </motion.button>
            );
          })}
        </div>

        {/* Next Page */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={clsx(
            'flex items-center gap-1 px-3 py-2 rounded-lg transition-all',
            currentPage === totalPages
              ? 'text-grey-400 cursor-not-allowed'
              : 'text-grey-600 hover:bg-grey-100 hover:text-grey-900'
          )}
          title="Next page"
        >
          <span className="text-label-medium hidden sm:inline">Next</span>
          <ChevronRightIcon className="w-4 h-4" />
        </motion.button>

        {/* Last Page */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handlePageClick(totalPages)}
          disabled={currentPage === totalPages}
          className={clsx(
            'p-2 rounded-lg transition-all',
            currentPage === totalPages
              ? 'text-grey-400 cursor-not-allowed'
              : 'text-grey-600 hover:bg-grey-100 hover:text-grey-900'
          )}
          title="Last page"
        >
          <ChevronDoubleRightIcon className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};

export default Pagination;

