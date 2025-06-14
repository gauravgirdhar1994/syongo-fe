import React from 'react';
import Button from './Button';

export function TextInput({ label, id, error, ...props }) {
  return (
    <div className="relative">
      <input
        id={id}
        {...props}
        className="peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder=" "
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-2.5 origin-[0] -translate-y-4 scale-75 transform bg-white px-1 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-2.5 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary-500"
      >
        {label}
      </label>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export function SelectInput({ label, id, error, children, ...props }) {
  return (
    <div className="relative">
      <select
        id={id}
        {...props}
        className="peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {children}
      </select>
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-2.5 origin-[0] -translate-y-4 scale-75 transform bg-white px-1 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-2.5 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary-500"
      >
        {label}
      </label>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export function TextArea({ label, id, error, ...props }) {
  return (
    <div className="relative">
      <textarea
        id={id}
        {...props}
        className="peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder=" "
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-2.5 origin-[0] -translate-y-4 scale-75 transform bg-white px-1 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-2.5 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary-500"
      >
        {label}
      </label>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export function Checkbox({ label, id, error, ...props }) {
  return (
    <div className="relative flex items-start">
      <div className="flex h-6 items-center">
        <input
          id={id}
          type="checkbox"
          {...props}
          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      </div>
      <div className="ml-3">
        <label htmlFor={id} className="text-sm text-gray-700">
          {label}
        </label>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}

export function FormActions({ onCancel, submitLabel = 'Save' }) {
  return (
    <div className="mt-6 flex justify-end gap-3">
      <Button
        variant="secondary"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button
        type="submit"
      >
        {submitLabel}
      </Button>
    </div>
  );
} 