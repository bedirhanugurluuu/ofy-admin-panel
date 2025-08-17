import React from 'react';

interface Column {
  key: string;
  label: string;
  render?: (value: any, item: any) => React.ReactNode;
  className?: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  emptyMessage?: string;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  editButtonText?: string;
  deleteButtonText?: string;
  showActions?: boolean;
}

export default function DataTable({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data found',
  onEdit,
  onDelete,
  editButtonText = 'Edit',
  deleteButtonText = 'Delete',
  showActions = true
}: DataTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
              {showActions && (onEdit || onDelete) && (
                <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={showActions && (onEdit || onDelete) ? columns.length + 1 : columns.length}
                  className="px-8 py-12 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-8 py-6 whitespace-nowrap text-sm ${column.className || ''}`}
                    >
                      {column.render
                        ? column.render(item[column.key], item)
                        : item[column.key]}
                    </td>
                  ))}
                  {showActions && (onEdit || onDelete) && (
                    <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          {editButtonText}
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className="text-red-600 hover:text-red-900"
                        >
                          {deleteButtonText}
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Image Column Renderer
export function ImageRenderer(imagePath: string, apiBaseUrl: string) {
  return (value: string) => (
    <img
      src={`${apiBaseUrl}/uploads/${value}`}
      alt="Preview"
      className="h-16 w-16 object-cover rounded-lg"
    />
  );
}

// Text Truncator
export function TruncatedText(maxLength: number = 50) {
  return (value: string) => {
    if (!value) return '';
    if (value.length <= maxLength) return value;
    return value.substring(0, maxLength) + '...';
  };
}

// Link Renderer
export function LinkRenderer() {
  return (value: string) => (
    <a
      href={value}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:text-blue-800 truncate block max-w-xs"
    >
      {value}
    </a>
  );
}

