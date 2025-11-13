// src/components/Table.jsx
export default function Table({ title, columns, data, onEdit, onDelete, onReset }) {
  // Helper to render column data safely
  const renderValue = (item, col) => {
    const key = col.toLowerCase();

    // Handle special cases
    switch (key) {
      case "email":
        return item.email || "-";
      case "rollno":
        return item.rollNo || "-";
      case "department":
        return item.department || "-";
      case "password":
        return "******"; // hide password
      case "name":
        return item.name || "-";
      default:
        // fallback: try to find a matching key ignoring case
        return (
          item[key] ||
          item[col] ||
          item[col.toLowerCase()] ||
          item[col.charAt(0).toLowerCase() + col.slice(1)] ||
          "-"
        );
    }
  };

  return (
    <div className="bg-white shadow rounded-xl mt-6">
      <h2 className="text-xl font-semibold px-4 py-3 border-b">{title}</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-600 text-white">
            {columns.map((col) => (
              <th key={col} className="p-3 text-left">
                {col}
              </th>
            ))}
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item._id} className="border-t hover:bg-gray-50 transition">
                {columns.map((col) => (
                  <td key={col} className="p-3">
                    {renderValue(item, col)}
                  </td>
                ))}
                <td className="p-3 text-center">
                  <button
                    onClick={() => onEdit(item)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onReset(item)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => onDelete(item._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="p-4 text-center text-gray-500"
              >
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
