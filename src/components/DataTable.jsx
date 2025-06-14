import React from 'react';
import Button from './Button';
import { Pagination } from './Pagination';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

function DataTable({ title, columns, data, onAdd, onEdit, onDelete, onView, currentPage, totalPages, onPageChange }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        <Button
          variant="primary"
          onClick={onAdd}
        >
          Add New
        </Button>
      </div>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="py-3 px-4 text-left text-sm font-semibold text-gray-900"
                >
                  {column.label}
                </th>
              ))}
              <th scope="col" className="relative py-3 px-4">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((item, index) => (
              <tr key={item.id || index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="whitespace-nowrap py-3 px-4 text-sm font-medium text-gray-900"
                  >
                    {item[column.key]}
                  </td>
                ))}
                <td className="relative whitespace-nowrap py-3 px-4 text-right text-sm font-medium">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onView(item)}
                      className="p-1 text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
                    >
                      <EyeIcon className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">View</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className="p-1 text-gray-600 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-full"
                    >
                      <PencilIcon className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item)}
                      className="p-1 text-gray-600 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full"
                    >
                      <TrashIcon className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-1">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}

export default DataTable; 