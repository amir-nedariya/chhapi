import React from 'react';
import EmptyState from './EmptyState';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSidebarColor } from '../../hooks/useSidebarColor';

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
             <div className="font-medium flex items-center gap-2" style={{ color: `#${sidebarColor}` }}>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
             </div>
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
                     Loading records...
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
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 px-4 py-3 gap-4 bg-gray-50/50 select-none">
          <div className="text-xs font-medium text-gray-500">
            Showing{" "}
            <span className="text-gray-800 font-semibold">
              {Math.min((pagination.currentPage - 1) * pagination.itemsPerPage + 1, pagination.totalItems)}
            </span>{" "}
            to{" "}
            <span className="text-gray-800 font-semibold">
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
            </span>{" "}
            of <span className="text-gray-800 font-semibold">{pagination.totalItems}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => pagination.onPageChange(Math.max(pagination.currentPage - 1, 1))}
              disabled={pagination.currentPage === 1}
              className="p-1.5 rounded-sm border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: pagination.totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isCurrent = pageNum === pagination.currentPage;

              if (
                pagination.totalPages <= 5 ||
                pageNum === 1 ||
                pageNum === pagination.totalPages ||
                Math.abs(pageNum - pagination.currentPage) <= 1
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => pagination.onPageChange(pageNum)}
                    style={isCurrent ? { backgroundColor: `#${sidebarColor}`, borderColor: `#${sidebarColor}` } : {}}
                    className={`min-w-[28px] h-7 flex items-center justify-center text-xs font-medium rounded-sm border transition-colors ${
                      isCurrent
                        ? "text-white"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }

              if (pageNum === 2 || pageNum === pagination.totalPages - 1) {
                return <span key={pageNum} className="px-1 text-gray-400 text-xs">...</span>;
              }

              return null;
            })}

            <button
              onClick={() => pagination.onPageChange(Math.min(pagination.currentPage + 1, pagination.totalPages))}
              disabled={pagination.currentPage === pagination.totalPages}
              className="p-1.5 rounded-sm border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
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
