import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addCategory,
  deleteCategory,
  updateCategory,
  selectCategories,
  fetchCategories,
} from "../store/slices/categorySlice";
import { selectAllExpenses, fetchExpenses } from "../store/slices/expenseSlice";
import {
  MdAdd,
  MdDelete,
  MdCategory,
  MdEdit,
  MdClose,
  MdSave,
} from "react-icons/md";

const ManageCategories = () => {
  const dispatch = useDispatch();
  const { items: categories, error: apiError } = useSelector(
    (state) => state.categories,
  );
  const expenses = useSelector(selectAllExpenses);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchExpenses());
  }, [dispatch]);

  const [newCat, setNewCat] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const handleAdd = (e) => {
    e.preventDefault();
    const cleanCat = newCat.trim();
    if (!cleanCat) return;

    if (
      categories.some((c) => c.name.toLowerCase() === cleanCat.toLowerCase())
    ) {
      setError("Category already exists!");
      return;
    }

    dispatch(addCategory({ name: cleanCat }));
    setNewCat("");
    setError("");
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const cleanName = editName.trim();
    if (!cleanName) return;

    if (
      categories.some(
        (c) =>
          c.name.toLowerCase() === cleanName.toLowerCase() &&
          c._id !== editingId,
      )
    ) {
      setError("A category with this name already exists!");
      return;
    }

    dispatch(updateCategory({ id: editingId, name: cleanName }));
    setEditingId(null);
    setEditName("");
    setError("");
  };

  const startEdit = (category) => {
    setEditingId(category._id);
    setEditName(category.name);
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setError("");
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(categories.length / pageSize);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = (category) => {
    // Check if category is actively being used
    const isUsed = expenses.some((exp) => exp.category === category);

    if (isUsed) {
      if (
        !window.confirm(
          `Warning: The category "${category}" is currently being used by existing expenses. Deleting it will keep those expenses but you won't be able to assign this category again. Continue?`,
        )
      ) {
        return;
      }
    } else {
      if (!window.confirm(`Are you sure you want to delete "${category}"?`)) {
        return;
      }
    }

    // Find the category object to get its ID if needed,
    // but our slice currently uses name.
    // Wait, the backend expects an ID for delete.
    // I need to update the category slice to store objects or handle name-based delete on backend.
    // I'll update the category slice to store objects.
    dispatch(deleteCategory(category));
  };

  return (
    <div className="container-fluid py-2">
      <h4 className="mb-4 text-gradient">Manage Categories</h4>

      {apiError && <div className="alert alert-danger mb-4">{apiError}</div>}

      <div className="row">
        <div className="col-lg-8">
          <div className="stat-card p-4">
            <h5 className="mb-4 d-flex align-items-center">
              <MdCategory className="text-primary me-2" size={24} />
              {editingId ? "Edit Category" : "Add New Category"}
            </h5>

            <form
              onSubmit={editingId ? handleUpdate : handleAdd}
              className="mb-4 d-flex gap-2"
            >
              <div className="flex-grow-1">
                <input
                  type="text"
                  className={`form-control ${error ? "is-invalid border-danger" : "border-primary"}`}
                  placeholder="e.g. Pet Care, Software Tools, Server Costs..."
                  value={editingId ? editName : newCat}
                  onChange={(e) => {
                    if (editingId) setEditName(e.target.value);
                    else setNewCat(e.target.value);
                    setError("");
                  }}
                />
                {error && <div className="invalid-feedback">{error}</div>}
              </div>
              {editingId ? (
                <>
                  <button
                    type="submit"
                    className="btn btn-success d-flex align-items-center px-4 rounded-2"
                  >
                    <MdSave className="me-1" /> Save
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="btn btn-outline-secondary d-flex align-items-center px-4 rounded-2"
                  >
                    <MdClose className="me-1" /> Cancel
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary d-flex align-items-center px-4 rounded-2"
                >
                  <MdAdd className="me-1" /> Add
                </button>
              )}
            </form>

            <h5 className="mb-3 mt-5">Category Management List</h5>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Category Name</th>
                    <th>Icon (Default)</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((cat) => (
                    <tr key={cat._id}>
                      <td>
                        <span className="fw-semibold">{cat.name}</span>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          <MdCategory className="me-1" />{" "}
                          {cat.icon || "category"}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => startEdit(cat)}
                        >
                          <MdEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(cat._id)}
                        >
                          <MdDelete />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <nav className="mt-4">
                <ul className="pagination justify-content-center">
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage - 1)}
                    >
                      Previous
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li
                      key={i}
                      className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => paginate(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}

            {categories.length === 0 && (
              <p className="text-muted text-center py-4">
                No custom categories found. Add one above!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCategories;
