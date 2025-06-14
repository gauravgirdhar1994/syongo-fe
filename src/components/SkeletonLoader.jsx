import React from 'react';

const SkeletonLoader = ({ type = 'table', rows = 5, columns = 4 }) => {
  if (type === 'table') {
    return (
      <div className="animate-pulse">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                {Array.from({ length: columns }).map((_, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="py-3 px-4 text-left text-sm font-semibold text-gray-900"
                  >
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </th>
                ))}
                <th scope="col" className="relative py-3 px-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {Array.from({ length: columns }).map((_, colIndex) => (
                    <td
                      key={colIndex}
                      className="whitespace-nowrap py-3 px-4 text-sm font-medium text-gray-900"
                    >
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </td>
                  ))}
                  <td className="relative whitespace-nowrap py-3 px-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-1">
                      <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (type === 'grid') {
    return (
      <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="animate-pulse space-y-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default SkeletonLoader; 