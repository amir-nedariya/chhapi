import React from 'react';
import EmptyState from './EmptyState';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSidebarColor } from '../../hooks/useSidebarColor';
import { MiniLoader } from './Loader';

const Table = ({ 
  columns = [], 
  data = [], 
  onRowClick = null, 
  emptyStateProps = {},
  isLoading = false,
  pagination = null, // Support for chhapi pagination
  emptyMessage,
  emptySubMessage
}) => {
  const sidebarColor = useSidebarColor();

  const hasData = data && data.length > 0;

  if (!hasData && !isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] w-full bg-white border border-gray-200 rounded-sm">
        <EmptyState 
          entityName={emptyStateProps.entityName || "Records"} 
          search={emptyStateProps.search}
          {...(emptyMessage && !emptyStateProps.search ? { customMessage: emptyMessage } : {})}
          {...emptyStateProps} 
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-sm overflow-hidden flex flex-col relative shadow-sm">
      <div className="overflow-x-auto custom-scrollbar flex-1">
        
        {/* Loading Overlay */}
        {isLoading && hasData && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
             <MiniLoader color={`#${sidebarColor}`} />
          </div>
        )}

        <div className="min-h-full">
          <table className="w-full text-left border-collapse min-w-max">
            <thead className="sticky top-0 z-10 text-white text-[12px] font-medium" style={{ backgroundColor: `#${sidebarColor}` }}>
              <tr>
                {columns.map((col, idx) => (
                  <th key={col.key || idx} className={`px-4 py-3.5 whitespace-nowrap ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : ''}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`bg-white transition-opacity duration-200 ${isLoading && !hasData ? 'opacity-50' : ''}`}>
              {isLoading && !hasData ? (
                 <tr>
                   <td colSpan={columns.length} className="py-20 text-center text-gray-500">
                     <MiniLoader color={`#${sidebarColor}`} className="mx-auto" />
                   </td>
                 </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <tr
                    key={row._id || row.id || rowIndex}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`border-b border-gray-100 transition-colors ${onRowClick ? 'hover:bg-gray-50/80 cursor-pointer' : 'hover:bg-gray-50/40'}`}
                  >
                    {columns.map((col, colIndex) => {
                      const cellValue = row[col.key || col.accessor];
                      return (
                        <td key={col.key || colIndex} className={`px-4 py-3 text-sm text-gray-600 ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : ''} ${col.className || ''}`}>
                          {col.render ? col.render(cellValue, row, rowIndex) : cellValue !== undefined ? String(cellValue) : "-"}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination Footer */}
      {pagination && hasData && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-4 bg-white select-none">
          <div className="text-sm text-slate-500">
            {Math.min((pagination.currentPage - 1) * pagination.itemsPerPage + 1, pagination.totalItems)} to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => pagination.onPageChange(Math.max(pagination.currentPage - 1, 1))}
              disabled={pagination.currentPage === 1}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-sm text-gray-600 font-medium">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <button
              onClick={() => pagination.onPageChange(Math.min(pagination.currentPage + 1, pagination.totalPages))}
              disabled={pagination.currentPage === pagination.totalPages}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
