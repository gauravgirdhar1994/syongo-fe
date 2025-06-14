import React from 'react';
import Button from './Button';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const maxVisiblePages = 5;
  
  let visiblePages = pages;
  if (totalPages > maxVisiblePages) {
    const start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const end = Math.min(totalPages, start + maxVisiblePages - 1);
    visiblePages = pages.slice(start - 1, end);
  }

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white py-1.5 px-2">
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          variant="text"
          size="small"
          shape="circle"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-gray-600 hover:text-primary-600"
        >
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Previous</span>
        </Button>
        <Button
          variant="text"
          size="small"
          shape="circle"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-gray-600 hover:text-primary-600"
        >
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Next</span>
        </Button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex items-center gap-1" aria-label="Pagination">
            <Button
              variant="text"
              size="small"
              shape="circle"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-gray-600 hover:text-primary-600"
            >
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Previous</span>
            </Button>
            {visiblePages.map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "primary" : "text"}
                size="small"
                onClick={() => onPageChange(page)}
                className={`${
                  currentPage === page 
                    ? 'bg-primary-600 text-white hover:bg-primary-700' 
                    : 'text-gray-700 hover:text-primary-600'
                }`}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="text"
              size="small"
              shape="circle"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="text-gray-600 hover:text-primary-600"
            >
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Next</span>
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
} 