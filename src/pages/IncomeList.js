import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteIncome,
  fetchIncomes,
  addIncome,
  updateIncome,
} from "../store/slices/incomeSlice";
import {
  selectMonthFilter,
  selectYearFilter,
} from "../store/slices/filterSlice";
import { MdDelete, MdEdit, MdDownload, MdAdd } from "react-icons/md";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import ConvertedAmount from "../components/Common/ConvertedAmount";

const IncomeList = () => {
  const { items: incomes } = useSelector((state) => state.incomes);
  const monthFilter = useSelector(selectMonthFilter);
  const yearFilter = useSelector(selectYearFilter);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIncomes());
  }, [dispatch]);

  const [filterSource, setFilterSource] = useState("All");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    source: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleClose = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentId(null);
    setFormData({
      title: "",
      amount: "",
      source: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const handleShow = (income = null) => {
    if (income) {
      setEditMode(true);
      setCurrentId(income._id);
      setFormData({
        title: income.title,
        amount: income.amount,
        source: income.source,
        date: new Date(income.date).toISOString().split("T")[0],
      });
    } else {
      setEditMode(false);
      setFormData({
        title: "",
        amount: "",
        source: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const action = editMode
      ? updateIncome({ id: currentId, ...formData })
      : addIncome(formData);

    dispatch(action)
      .unwrap()
      .then(() => {
        handleClose();
      });
  };

  const sources = ["All", ...new Set(incomes.map((item) => item.source))];

  const filteredIncomes = incomes.filter((inc) => {
    const d = new Date(inc.date);
    const matchM =
      monthFilter === "All" || d.getMonth() === parseInt(monthFilter);
    const matchY =
      yearFilter === "All" || d.getFullYear() === parseInt(yearFilter);
    const matchC = filterSource === "All" || inc.source === filterSource;
    return matchM && matchY && matchC;
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this income?")) {
      dispatch(deleteIncome(id));
    }
  };

  const handleExportCSV = () => {
    const headers = ["Title", "Source", "Date", "Amount"];
    const csvData = filteredIncomes.map((inc) => [
      `"${inc.title.replace(/"/g, '""')}"`,
      `"${inc.source}"`,
      new Date(inc.date).toLocaleDateString(),
      inc.amount,
    ]);

    const csvContent = [headers, ...csvData].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `incomes_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container-fluid py-2">
      <div className="d-flex justify-content-between align-items-sm-center flex-column flex-sm-row mb-4 gap-3">
        <h4 className="mb-0 text-gradient">All Incomes</h4>

        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-success d-flex align-items-center text-white shadow-sm"
            onClick={() => handleShow()}
          >
            <MdAdd className="me-1" /> Add Income
          </button>

          <button
            className="btn btn-sm btn-outline-success d-flex align-items-center"
            onClick={handleExportCSV}
            disabled={filteredIncomes.length === 0}
          >
            <MdDownload className="me-1" /> Export CSV
          </button>

          <div className="d-flex align-items-center gap-2">
            <label className="fw-semibold text-muted mb-0 small">Source:</label>
            <select
              className="form-select form-select-sm"
              style={{ width: "auto" }}
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
            >
              {sources.map((src, i) => (
                <option key={i} value={src}>
                  {src}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="table-container border-top border-success border-1">
        {filteredIncomes.length === 0 ? (
          <div className="text-center py-5">
            <h5 className="text-muted">No income records found.</h5>
            <button
              className="btn btn-success mt-3 text-white fw-bold shadow-sm"
              onClick={() => handleShow()}
            >
              Add New Income
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Title</th>
                  <th>Source</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...filteredIncomes]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((inc) => (
                    <tr key={inc._id}>
                      <td className="fw-semibold text-main">{inc.title}</td>
                      <td>
                        <span className="badge rounded-pill bg-success bg-opacity-10 text-success px-3 py-2 border border-success border-opacity-25">
                          {inc.source}
                        </span>
                      </td>
                      <td className="text-muted">
                        {new Date(inc.date).toLocaleDateString()}
                      </td>
                      <td className="text-success fw-semibold">
                        +<ConvertedAmount amount={inc.amount} />
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() => handleShow(inc)}
                        >
                          <MdEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(inc._id)}
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
            {editMode ? "Edit Income" : "Add New Income"}
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
                    placeholder="Enter income title"
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
                    Source
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Salary, Freelance, Dividend"
                    className="p-3 bg-light border-0 shadow-sm"
                    value={formData.source}
                    onChange={(e) =>
                      setFormData({ ...formData, source: e.target.value })
                    }
                    required
                  />
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
              variant="success"
              type="submit"
              className="px-5 fw-bold text-white shadow border-0"
            >
              {editMode ? "Save Changes" : "Add Income"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default IncomeList;
