import { useMemo, useState, type ReactNode } from 'react';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  filterOptions?: Array<{ label: string; value: string }>;
  width?: string;
  mode?: 'fixed' | 'flex';
  render?: (value: unknown, row: T) => ReactNode;
  getValue?: (row: T) => unknown;
  sortValue?: (row: T) => string | number | Date | undefined;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyState?: ReactNode;
  className?: string;
}

export function DataTable<T>({ columns, data, emptyState, className = '' }: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  const filteredData = useMemo(() => {
    const sortableColumns = columns.filter((column) => column.filterable);
    return data.filter((row) => {
      return sortableColumns.every((column) => {
        const filterValue = columnFilters[String(column.key)]?.trim().toLowerCase();
        if (!filterValue) {
          return true;
        }

        const value = column.getValue ? column.getValue(row) : getValue(row, column.key);
        return String(value ?? '').toLowerCase().includes(filterValue);
      });
    });
  }, [columns, columnFilters, data]);

  const sortedData = useMemo(() => {
    if (!sortConfig) {
      return filteredData;
    }

    const column = columns.find((item) => String(item.key) === sortConfig.key);
    if (!column) {
      return filteredData;
    }

    const sorted = [...filteredData].sort((a, b) => {
      const left = column.sortValue ? column.sortValue(a) : getValue(a, column.key);
      const right = column.sortValue ? column.sortValue(b) : getValue(b, column.key);
      return compareValues(left, right);
    });

    if (sortConfig.direction === 'desc') {
      sorted.reverse();
    }

    return sorted;
  }, [columns, filteredData, sortConfig]);

  const toggleSort = (column: Column<T>) => {
    if (!column.sortable) {
      return;
    }

    setSortConfig((current) => {
      if (!current || current.key !== String(column.key)) {
        return { key: String(column.key), direction: 'asc' };
      }

      return current.direction === 'asc' ? { key: String(column.key), direction: 'desc' } : null;
    });
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-white/5">
            <tr>
              {columns.map((column) => {
                const isSorted = sortConfig?.key === String(column.key);
                const sortIndicator = isSorted ? (sortConfig?.direction === 'asc' ? '↑' : '↓') : '';
                const headerStyle = column.mode === 'fixed' && column.width ? { width: column.width } : undefined;

                return (
                  <th
                    key={String(column.key)}
                    className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 ${column.sortable ? 'cursor-pointer select-none' : ''}`}
                    style={headerStyle}
                    onClick={() => toggleSort(column)}
                  >
                    <div className="flex flex-col gap-2">
                      <span className="flex items-center gap-1">
                        {column.header}
                        {column.sortable ? <span className="text-[11px]">{sortIndicator}</span> : null}
                      </span>
                      {column.filterable ? (
                        column.filterOptions ? (
                          <select
                            value={columnFilters[String(column.key)] ?? ''}
                            onChange={(event) => setColumnFilters((current) => ({ ...current, [String(column.key)]: event.target.value }))}
                            onClick={(event) => event.stopPropagation()}
                            className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 outline-none dark:border-gray-700 dark:bg-background-dark dark:text-gray-200"
                          >
                            <option value="">All</option>
                            {column.filterOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={columnFilters[String(column.key)] ?? ''}
                            onChange={(event) => setColumnFilters((current) => ({ ...current, [String(column.key)]: event.target.value }))}
                            onClick={(event) => event.stopPropagation()}
                            placeholder={`Filter ${column.header}`}
                            className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 outline-none dark:border-gray-700 dark:bg-background-dark dark:text-gray-200"
                          />
                        )
                      ) : null}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-[#13271d]">
            {sortedData.length > 0 ? (
              sortedData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-white/5">
                  {columns.map((column) => {
                    const value = column.getValue ? column.getValue(row) : getValue(row, column.key);
                    const cellStyle = column.mode === 'fixed' && column.width ? { width: column.width } : undefined;
                    return (
                      <td key={String(column.key)} className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200" style={cellStyle}>
                        {column.render ? column.render(value, row) : renderValue(value)}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                  {emptyState ?? 'No records found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {sortedData.length > 0 ? (
          sortedData.map((row, index) => (
            <div key={index} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-[#13271d]">
              {columns.map((column) => {
                const value = column.getValue ? column.getValue(row) : getValue(row, column.key);
                return (
                  <div key={String(column.key)} className="flex items-start justify-between gap-4 py-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{column.header}</span>
                    <div className="text-right text-sm text-gray-900 dark:text-gray-100">
                      {column.render ? column.render(value, row) : renderValue(value)}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            {emptyState ?? 'No records found'}
          </div>
        )}
      </div>
    </div>
  );
}

function getValue<T>(row: T, key: keyof T | string) {
  if (typeof key === 'string' && key in (row as Record<string, unknown>)) {
    return (row as Record<string, unknown>)[key];
  }

  return undefined;
}

function renderValue(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  return String(value);
}

function compareValues(left: unknown, right: unknown) {
  if (left === undefined && right === undefined) {
    return 0;
  }

  if (left === undefined) {
    return 1;
  }

  if (right === undefined) {
    return -1;
  }

  if (typeof left === 'number' && typeof right === 'number') {
    return left - right;
  }

  if (left instanceof Date && right instanceof Date) {
    return left.getTime() - right.getTime();
  }

  if (typeof left === 'string' && typeof right === 'string') {
    return left.localeCompare(right);
  }

  return String(left).localeCompare(String(right));
}
