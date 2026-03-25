import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCategories,
  fetchCategories,
} from "../store/slices/categorySlice";
import {
  fetchBudgets,
  setBudget,
  selectAllBudgets,
} from "../store/slices/budgetSlice";
import { selectAllExpenses, fetchExpenses } from "../store/slices/expenseSlice";
import {
  selectMonthFilter,
  selectYearFilter,
} from "../store/slices/filterSlice";
import {
  Modal,
  Button,
  Form,
  ProgressBar,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { MdEdit, MdWarning, MdCheckCircle, MdTrendingUp } from "react-icons/md";
import ConvertedAmount from "../components/Common/ConvertedAmount";

const ManageBudgets = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const budgets = useSelector(selectAllBudgets);
  const expenses = useSelector(selectAllExpenses);
  const monthFilter = useSelector(selectMonthFilter);
  const yearFilter = useSelector(selectYearFilter);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    month:
      monthFilter === "All" ? new Date().getMonth() : parseInt(monthFilter),
    year:
      yearFilter === "All" ? new Date().getFullYear() : parseInt(yearFilter),
  });

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchExpenses());
    const fetchParams = {
      month:
        monthFilter === "All" ? new Date().getMonth() : parseInt(monthFilter),
      year:
        yearFilter === "All" ? new Date().getFullYear() : parseInt(yearFilter),
    };
    dispatch(fetchBudgets(fetchParams));
  }, [dispatch, monthFilter, yearFilter]);

  const handleShow = (budget = null) => {
    if (budget) {
      setEditMode(true);
      setFormData({
        category: budget.category,
        amount: budget.amount.toString(),
        month: budget.month,
        year: budget.year,
      });
    } else {
      setEditMode(false);
      setFormData({
        category: "",
        amount: "",
        month:
          monthFilter === "All" ? new Date().getMonth() : parseInt(monthFilter),
        year:
          yearFilter === "All"
            ? new Date().getFullYear()
            : parseInt(yearFilter),
      });
    }
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setBudget(formData))
      .unwrap()
      .then(() => handleClose());
  };

  const getActualSpending = (categoryName) => {
    const targetMonth = formData.month;
    const targetYear = formData.year;

    return expenses
      .filter((exp) => {
        const d = new Date(exp.date);
        return (
          exp.category === categoryName &&
          d.getMonth() === targetMonth &&
          d.getFullYear() === targetYear
        );
      })
      .reduce((sum, exp) => sum + exp.amount, 0);
  };

  return (
    <div className="container-fluid py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 text-gradient">Budget Management</h4>
          <p className="text-muted small mb-0">
            Track your spending against set limits
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => handleShow()}
          className="fw-bold px-4 shadow-sm"
        >
          Set New Budget
        </Button>
      </div>

      <Row className="g-4">
        {categories.map((cat) => {
          const budget = budgets.find((b) => b.category === cat.name);
          const actual = getActualSpending(cat.name);
          const limit = budget ? budget.amount : 0;
          const percent = limit > 0 ? (actual / limit) * 100 : 0;
          const isOver = actual > limit && limit > 0;

          return (
            <Col key={cat._id} xl={4} lg={6}>
              <Card className="border-0 shadow-sm h-100 premium-card">
                <Card.Body className="p-4 border rounded-3">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center">
                      <div className="category-icon-circle me-3 bg-primary bg-opacity-10 text-primary">
                        <MdTrendingUp size={20} />
                      </div>
                      <div>
                        <h6 className="mb-0 text-gradient">{cat.name}</h6>
                        <span className="text-muted extra-small">
                          Monthly Limit
                        </span>
                      </div>
                    </div>
                    <button
                      className="btn btn-link p-0 text-muted"
                      onClick={() => handleShow(budget)}
                    >
                      <MdEdit size={18} />
                    </button>
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-end mb-2">
                      <div className="text-muted small">
                        Spent:{" "}
                        <small className="fw-bold">
                          <ConvertedAmount amount={actual} />
                        </small>
                      </div>
                      <div className="text-muted small">
                        Budget:{" "}
                        <small className="fw-bold">
                          <ConvertedAmount amount={limit} />
                        </small>
                      </div>
                    </div>
                    <ProgressBar
                      now={percent > 100 ? 100 : percent}
                      variant={
                        isOver ? "danger" : percent > 80 ? "warning" : "primary"
                      }
                      style={{ height: "8px" }}
                      className="rounded-pill bg-light"
                    />
                  </div>

                  <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-auto">
                    {limit === 0 ? (
                      <span className="badge bg-light text-muted fw-normal">
                        No limit set
                      </span>
                    ) : isOver ? (
                      <span className="text-danger small fw-semibold d-flex align-items-center">
                        <MdWarning className="me-1" /> Over budget by{" "}
                        <ConvertedAmount amount={actual - limit} />
                      </span>
                    ) : (
                      <span className="text-success small fw-semibold d-flex align-items-center">
                        <MdCheckCircle className="me-1" />{" "}
                        <ConvertedAmount amount={limit - actual} /> &nbsp;
                        Remaining
                      </span>
                    )}
                    <span className="fw-semibold small">
                      {Math.round(percent)}%
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton className="">
          <Modal.Title className="fw-semibold">
            {editMode ? "Edit Category Budget" : "Set Category Budget"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-muted">
                Category
              </Form.Label>
              <Form.Select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
                className="p-3 bg-light"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-muted">
                Monthly Limit
              </Form.Label>
              <Form.Control
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
                placeholder="0.00"
                className="p-3 bg-light"
              />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold text-muted">
                    Month
                  </Form.Label>
                  <Form.Select
                    value={formData.month}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        month: parseInt(e.target.value),
                      })
                    }
                    className="p-3 bg-light"
                  >
                    {[
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ].map((m, i) => (
                      <option key={i} value={i}>
                        {m}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold text-muted">
                    Year
                  </Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        year: parseInt(e.target.value),
                      })
                    }
                    className="p-3 bg-light"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="">
            <Button variant="light" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="fw-semibold text-white shadow"
            >
              Save Budget
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageBudgets;
