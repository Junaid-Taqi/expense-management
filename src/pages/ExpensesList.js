import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllExpenses,
  deleteExpense,
  fetchExpenses,
  addExpense,
  updateExpense,
} from "../store/slices/expenseSlice";
import {
  selectCategories,
  fetchCategories,
} from "../store/slices/categorySlice";
import {
  selectMonthFilter,
  selectYearFilter,
} from "../store/slices/filterSlice";
import { MdDelete, MdEdit, MdDownload, MdAdd } from "react-icons/md";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import ConvertedAmount from "../components/Common/ConvertedAmount";

const ExpensesList = () => {
  const expenses = useSelector(selectAllExpenses);
  const dynamicCategories = useSelector(selectCategories);
  const monthFilter = useSelector(selectMonthFilter);
  const yearFilter = useSelector(selectYearFilter);
  const dispatch = useDispatch();

  const [filterCategory, setFilterCategory] = useState("All");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleClose = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentId(null);
    setFormData({
      title: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const handleShow = (expense = null) => {
    if (expense) {
      setEditMode(true);
      setCurrentId(expense._id);
      setFormData({
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        date: new Date(expense.date).toISOString().split("T")[0],
      });
    } else {
      setEditMode(false);
      setFormData({
        title: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const action = editMode
      ? updateExpense({ id: currentId, ...formData })
      : addExpense(formData);

    dispatch(action)
      .unwrap()
      .then(() => {
        handleClose();
      });
  };

  useEffect(() => {
    dispatch(fetchExpenses());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Extract unique categories for filter
  const categories = ["All", ...dynamicCategories.map((c) => c.name)];

  const filteredExpenses = expenses.filter((exp) => {
    const d = new Date(exp.date);
    const matchM =
      monthFilter === "All" || d.getMonth() === parseInt(monthFilter);
    const matchY =
      yearFilter === "All" || d.getFullYear() === parseInt(yearFilter);
    const matchC = filterCategory === "All" || exp.category === filterCategory;
    return matchM && matchY && matchC;
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      dispatch(deleteExpense(id));
    }
  };

  const handleExportCSV = () => {
    const headers = ["Title", "Category", "Date", "Amount"];
    const csvData = filteredExpenses.map((exp) => [
      `"${exp.title.replace(/"/g, '""')}"`,
      `"${exp.category}"`,
      new Date(exp.date).toLocaleDateString(),
      exp.amount,
    ]);

    const csvContent = [headers, ...csvData].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `expenses_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container-fluid py-2">
      <div className="d-flex justify-content-between align-items-sm-center flex-column flex-sm-row mb-4 gap-3">
        <h4 className="mb-2 text-gradient">All Expenses</h4>

        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-primary d-flex align-items-center"
            onClick={() => handleShow()}
          >
            <MdAdd className="me-1" /> Add Expense
          </button>

          <button
            className="btn btn-outline-primary d-flex align-items-center"
            onClick={handleExportCSV}
            disabled={filteredExpenses.length === 0}
          >
            <MdDownload className="me-1" /> Export CSV
          </button>

          <div className="d-flex align-items-center gap-2">
            <label className="fw-semibold text-muted mb-0 small">
              Category:
            </label>
            <select
              className="form-select form-select-sm"
              style={{ width: "auto" }}
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="table-container">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-5">
            <h5 className="text-muted">No expenses found for this category.</h5>
            <button
              className="btn btn-primary mt-3"
              onClick={() => handleShow()}
            >
              Add New Expense
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...filteredExpenses]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((exp) => (
                    <tr key={exp._id}>
                      <td className="fw-semibold text-main">{exp.title}</td>
                      <td>
                        <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-2 border border-primary border-opacity-25">
                          {exp.category}
                        </span>
                      </td>
                      <td className="text-muted">
                        {new Date(exp.date).toLocaleDateString()}
                      </td>
                      <td className="fw-semibold">
                        <ConvertedAmount amount={exp.amount} />
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() => handleShow(exp)}
                        >
                          <MdEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(exp._id)}
                        >
                          <MdDelete />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold text-gradient">
            {editMode ? "Edit Expense" : "Add New Expense"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="py-4">
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">
                    Description / Title
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter expense title"
                    className="p-3 bg-light border-0 shadow-sm"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">
                    Amount
                  </Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="p-3 bg-light border-0 shadow-sm font-monospace"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">
                    Date
                  </Form.Label>
                  <Form.Control
                    type="date"
                    className="p-3 bg-light border-0 shadow-sm"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">
                    Category
                  </Form.Label>
                  <Form.Select
                    className="p-3 bg-light border-0 shadow-sm"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Category</option>
                    {dynamicCategories.map((cat, i) => (
                      <option key={i} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <Button
              variant="light"
              onClick={handleClose}
              className="px-4 fw-bold"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="px-5 fw-bold text-white shadow"
            >
              {editMode ? "Save Changes" : "Add Expense"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ExpensesList;
