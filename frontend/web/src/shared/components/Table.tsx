import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import Button from './Button';
import clsx from 'clsx';

interface TableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  pageSize?: number;
  showPagination?: boolean;
  isLoading?: boolean;
  emptyMessage?: string;
}

function Table<TData>({
  data,
  columns,
  pageSize = 20,
  showPagination = true,
  isLoading = false,
  emptyMessage = 'No data available',
}: TableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-grey-500">
        <p className="text-body-large">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-grey-50 border-b border-grey-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-label-large text-grey-700"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={clsx(
                          'flex items-center',
                          header.column.getCanSort() && 'cursor-pointer select-none'
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <span className="ml-2">
                            {header.column.getIsSorted() === 'asc' ? (
                              <ChevronUpIcon className="w-4 h-4" />
                            ) : header.column.getIsSorted() === 'desc' ? (
                              <ChevronDownIcon className="w-4 h-4" />
                            ) : (
                              <ChevronUpIcon className="w-4 h-4 opacity-30" />
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-grey-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-grey-50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 text-body-medium text-grey-900"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-grey-200">
          <div className="text-body-small text-grey-600">
            Showing {table.getState().pagination.pageIndex * pageSize + 1} to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * pageSize,
              data.length
            )}{' '}
            of {data.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <span className="text-body-small text-grey-600">
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;

