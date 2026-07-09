import React from "react";
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { TableLoader } from "./Loader";

/**
 * A highly customizable, accessible, and premium Table component.
 * Features built-in pagination controls, loading overlays, sorting indicators,
 * responsive design, and custom cell rendering.
 */
const Table = ({
  columns = [], // Array of: { key, header, render, align: 'left'|'center'|'right', className, sortable: bool }
  data = [], // Array of row objects
  isLoading = false,
  pagination = null, // { currentPage, totalPages, totalItems, itemsPerPage, onPageChange }
  emptyMessage = "No records found",
  emptySubMessage = "Try loosening your search keywords or switching filters.",
  onRowClick = null,
  hoverable = true,
  striped = false,
  sortBy = null, // Current active sort column key
  sortOrder = "asc", // 'asc' | 'desc'
  onSort = null, // Callback function: (columnKey, direction)
  className = "",
}) => {
  const handleSortClick = (col) => {
    if (!col.sortable || !onSort) return;
    const isCurrent = sortBy === col.key;
    const newOrder = isCurrent && sortOrder === "asc" ? "desc" : "asc";
    onSort(col.key, newOrder);
  };

  // Helper to resolve cell alignment
  const getAlignClass = (align) => {
    switch (align) {
      case "right":
        return "text-right";
      case "center":
        return "text-center";
      case "left":
      default:
        return "text-left";
    }
  };

  const getAlignJustifyClass = (align) => {
    switch (align) {
      case "right":
        return "justify-end";
      case "center":
        return "justify-center";
      case "left":
      default:
        return "justify-start";
    }
  };

  return (
    <div className={`w-full bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden flex flex-col relative ${className}`}>
      
      {/* Table Content Container */}
      <div className="overflow-x-auto relative w-full scrollbar-thin scrollbar-thumb-slate-200">
        
        {/* Loading Overlay */}
        {isLoading && data.length > 0 && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-xs z-10 flex items-center justify-center transition-all duration-300">
            <TableLoader text="Synchronizing records..." subText="Updating latest data registers" />
          </div>
        )}

        <table className="w-full text-slate-700 border-collapse min-w-[640px]">
          
          {/* Table Headers */}
          <thead className="bg-gradient-to-r from-sidebar-from via-sidebar-via to-sidebar-to text-white select-none">
            <tr className="border-b border-teal-950/20 text-xs font-bold tracking-wider uppercase">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSortClick(col)}
                  className={`py-4 px-5 font-semibold text-xs tracking-wider uppercase transition-colors duration-200 ${getAlignClass(col.align)} ${
                    col.sortable && onSort ? "cursor-pointer hover:bg-white/10" : ""
                  } ${col.className || ""}`}
                >
                  <div className={`inline-flex items-center gap-1.5 ${getAlignJustifyClass(col.align)} w-full`}>
                    <span>{col.header}</span>
                    {col.sortable && onSort && (
                      <span className="flex flex-col text-[8px] opacity-70">
                        <span className={`leading-none ${sortBy === col.key && sortOrder === "asc" ? "text-cyan-200 font-extrabold" : ""}`}>▲</span>
                        <span className={`leading-none ${sortBy === col.key && sortOrder === "desc" ? "text-cyan-200 font-extrabold" : ""}`}>▼</span>
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className={`divide-y divide-slate-100 text-sm transition-all duration-300 ${isLoading && data.length === 0 ? "opacity-30" : ""}`}>
            
            {/* Empty State */}
            {!isLoading && data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="py-16 px-5 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-full text-slate-400 animate-bounce [animation-duration:3s]">
                      <Inbox size={32} className="stroke-[1.5]" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-bold text-slate-800">{emptyMessage}</p>
                      {emptySubMessage && (
                        <p className="text-xs text-slate-400 font-medium leading-relaxed">
                          {emptySubMessage}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            )}

            {/* Loading Initial State */}
            {isLoading && data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="py-2">
                  <TableLoader text="Loading ledger registers..." subText="Reading details from ledger vault" />
                </td>
              </tr>
            )}

            {/* Standard Rows */}
            {!isLoading && data.map((row, rowIndex) => (
              <tr
                key={row._id || row.id || rowIndex}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors duration-150 ${
                  hoverable ? "hover:bg-slate-50/60" : ""
                } ${
                  striped && rowIndex % 2 !== 0 ? "bg-slate-50/20" : ""
                } ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
              >
                {columns.map((col) => {
                  const cellValue = row[col.key];
                  return (
                    <td
                      key={col.key}
                      className={`py-4 px-5 align-middle text-slate-600 font-medium ${getAlignClass(col.align)} ${
                        col.className || ""
                      }`}
                    >
                      {col.render ? col.render(cellValue, row, rowIndex) : cellValue !== undefined ? String(cellValue) : "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && data.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 px-6 py-4 gap-4 bg-slate-50/50 select-none">
          
          {/* Pagination Meta Text */}
          <div className="text-xs font-semibold text-slate-500">
            Showing{" "}
            <span className="text-slate-800">
              {Math.min((pagination.currentPage - 1) * pagination.itemsPerPage + 1, pagination.totalItems)}
            </span>{" "}
            to{" "}
            <span className="text-slate-800">
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
            </span>{" "}
            of <span className="text-slate-800">{pagination.totalItems}</span> records
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => pagination.onPageChange(Math.max(pagination.currentPage - 1, 1))}
              disabled={pagination.currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-500 transition-all duration-200 cursor-pointer active:scale-95 disabled:active:scale-100"
            >
              <ChevronLeft size={16} className="stroke-[2.5]" />
            </button>

            {/* Smart page numbering */}
            {Array.from({ length: pagination.totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isCurrent = pageNum === pagination.currentPage;
              
              // Only render standard page count if <= 5 or within window around current page
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
                    className={`min-w-8 h-8 flex items-center justify-center text-xs font-bold rounded-lg border transition-all duration-200 cursor-pointer active:scale-95 ${
                      isCurrent
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
              
              // Add ellipses
              if (
                pageNum === 2 ||
                pageNum === pagination.totalPages - 1
              ) {
                return (
                  <span key={pageNum} className="px-1 text-slate-400 text-xs font-bold">
                    ...
                  </span>
                );
              }

              return null;
            })}

            <button
              onClick={() =>
                pagination.onPageChange(Math.min(pagination.currentPage + 1, pagination.totalPages))
              }
              disabled={pagination.currentPage === pagination.totalPages}
              className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-500 transition-all duration-200 cursor-pointer active:scale-95 disabled:active:scale-100"
            >
              <ChevronRight size={16} className="stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
