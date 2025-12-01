// src/components/Table.jsx
import { useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiSearch,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiEye,
  FiMoreVertical,
  FiDownload,
  FiPlus
} from "react-icons/fi";

export default function Table({ 
  title, 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  onReset, 
  onView,
  onCreate,
  onExport,
  searchable = true,
  pagination = true,
  actions = true
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState([]);

  // Helper to render column data safely
  const renderValue = (item, col) => {
    const key = col.toLowerCase();

    // Handle special cases
    switch (key) {
      case "email":
        return (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
              {item.email || "-"}
            </span>
          </div>
        );
      case "rollno":
        return (
          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
            {item.rollNo || "-"}
          </span>
        );
      case "department":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {item.department || "-"}
          </span>
        );
      case "password":
        return (
          <div className="flex items-center space-x-1 text-gray-400">
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        );
      case "name":
        return (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {item.name ? item.name.charAt(0).toUpperCase() : "U"}
            </div>
            <span className="font-medium text-gray-900">{item.name || "-"}</span>
          </div>
        );
      case "status":
        const status = item.status?.toLowerCase() || 'active';
        const statusColors = {
          active: "bg-green-100 text-green-800",
          inactive: "bg-gray-100 text-gray-800",
          pending: "bg-yellow-100 text-yellow-800",
          blocked: "bg-red-100 text-red-800"
        };
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || statusColors.inactive}`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1 ${status === 'active' ? 'bg-green-500' : status === 'pending' ? 'bg-yellow-500' : status === 'blocked' ? 'bg-red-500' : 'bg-gray-500'}`}></span>
            {item.status || "Active"}
          </span>
        );
      default:
        const value = item[key] || item[col] || item[col.toLowerCase()] || item[col.charAt(0).toLowerCase() + col.slice(1)] || "-";
        return <span className="text-gray-700">{value}</span>;
    }
  };

  // Filter data based on search term
  const filteredData = data.filter(item =>
    columns.some(col => {
      const value = renderValue(item, col);
      return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key] || '';
    const bValue = b[sortConfig.key] || '';
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = pagination 
    ? sortedData.slice(startIndex, startIndex + itemsPerPage)
    : sortedData;

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(paginatedData.map(item => item._id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50/30">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-600 mt-1">
              {filteredData.length} of {data.length} records
              {selectedRows.length > 0 && ` • ${selectedRows.length} selected`}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {searchable && (
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-64"
                />
              </div>
            )}
            
            {onExport && (
              <button
                onClick={onExport}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                <FiDownload className="w-4 h-4" />
                <span>Export</span>
              </button>
            )}
            
            {onCreate && (
              <button
                onClick={onCreate}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add New</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-100 to-blue-100/50 border-b border-gray-200">
              <th className="p-4 w-12">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              {columns.map((col) => (
                <th 
                  key={col} 
                  className="p-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200/50 transition-colors duration-150"
                  onClick={() => handleSort(col.toLowerCase())}
                >
                  <div className="flex items-center space-x-2">
                    <span>{col}</span>
                    {sortConfig.key === col.toLowerCase() && (
                      <span className="text-gray-400">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="p-4 text-right text-sm font-semibold text-gray-700">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr 
                  key={item._id} 
                  className={`hover:bg-blue-50/30 transition-all duration-200 ${
                    selectedRows.includes(item._id) ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(item._id)}
                      onChange={() => handleSelectRow(item._id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  {columns.map((col) => (
                    <td key={col} className="p-4">
                      {renderValue(item, col)}
                    </td>
                  ))}
                  {actions && (
                    <td className="p-4">
                      <div className="flex items-center justify-end space-x-2">
                        {onView && (
                          <button
                            onClick={() => onView(item)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                            title="View"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                        )}
                        
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors duration-200"
                            title="Edit"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                        )}
                        
                        {onReset && (
                          <button
                            onClick={() => onReset(item)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                            title="Reset"
                          >
                            <FiRefreshCw className="w-4 h-4" />
                          </button>
                        )}
                        
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item._id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={columns.length + (actions ? 2 : 1)}
                  className="p-8 text-center"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <FiSearch className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">No records found</p>
                      <p className="text-gray-600 mt-1">
                        {searchTerm ? "Try adjusting your search criteria" : "No data available in table"}
                      </p>
                    </div>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries
              </span>
              
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors duration-200"
              >
                <FiChevronsLeft className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors duration-200"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm font-medium">
                {currentPage}
              </span>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors duration-200"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors duration-200"
              >
                <FiChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}