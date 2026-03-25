import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addIncome,
  updateIncome,
  selectAllIncomes,
  fetchIncomes,
} from "../store/slices/incomeSlice";
import { selectCurrencySymbol } from "../store/slices/currencySlice";
import { useNavigate, useParams } from "react-router-dom";
import { MdSave, MdArrowBack } from "react-icons/md";

const AddIncome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const allIncomes = useSelector(selectAllIncomes);
  const currencySymbol = useSelector(selectCurrencySymbol);

  useEffect(() => {
    dispatch(fetchIncomes());
  }, [dispatch]);

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    source: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      const incomeToEdit = allIncomes.find((inc) => inc._id === id);
      if (incomeToEdit) {
        setFormData({
          title: incomeToEdit.title,
          amount: incomeToEdit.amount,
          source: incomeToEdit.source,
          date: new Date(incomeToEdit.date).toISOString().split("T")[0],
        });
      } else {
        navigate("/incomes");
      }
    }
  }, [id, isEditMode, allIncomes, navigate]);

  const validate = () => {
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (
      !formData.amount ||
      isNaN(formData.amount) ||
      parseFloat(formData.amount) <= 0
    ) {
      newErrors.amount = "Please enter a valid amount greater than 0";
    }
    if (!formData.source.trim()) newErrors.source = "Source is required";
    if (!formData.date) newErrors.date = "Date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const action = isEditMode
        ? updateIncome({
            id,
            ...formData,
            date: new Date(formData.date).toISOString(),
          })
        : addIncome({
            ...formData,
            date: new Date(formData.date).toISOString(),
          });

      dispatch(action)
        .unwrap()
        .then(() => {
          navigate("/incomes");
        })
        .catch((err) => {
          // Error is handled by Redux error state
        });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const predefinedSources = [
    "Salary",
    "Business",
    "Investments",
    "Freelance",
    "Gifts",
    "Refunds",
    "Other",
  ];

  return (
    <div className="container-fluid py-2">
      <div className="d-flex align-items-center mb-4">
        <button
          className="btn btn-outline-secondary me-3"
          onClick={() => navigate(-1)}
        >
          <MdArrowBack />
        </button>
        <h4 className="mb-0 text-gradient">
          {isEditMode ? "Edit Income" : "Add New Income"}
        </h4>
      </div>

      <div className="row">
        <div className="col-lg-8 col-xl-6">
          <div className="table-container border-top border-success border-1">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Title</label>
                <input
                  type="text"
                  className={`form-control p-3 ${errors.title ? "is-invalid" : ""}`}
                  name="title"
                  placeholder="e.g. Monthly Salary"
                  value={formData.title}
                  onChange={handleChange}
                />
                {errors.title && (
                  <div className="invalid-feedback">{errors.title}</div>
                )}
              </div>

              <div className="row mb-3">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label className="form-label fw-semibold">
                    Amount ({currencySymbol})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className={`form-control p-3 ${errors.amount ? "is-invalid" : ""}`}
                    name="amount"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleChange}
                  />
                  {errors.amount && (
                    <div className="invalid-feedback">{errors.amount}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Date</label>
                  <input
                    type="date"
                    className={`form-control p-3 ${errors.date ? "is-invalid" : ""}`}
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                  {errors.date && (
                    <div className="invalid-feedback">{errors.date}</div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Income Source</label>
                <select
                  className={`form-select p-3 ${errors.source ? "is-invalid" : ""}`}
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                >
                  <option value="">Select a source</option>
                  {predefinedSources.map((src) => (
                    <option key={src} value={src}>
                      {src}
                    </option>
                  ))}
                </select>
                {errors.source && (
                  <div className="invalid-feedback">{errors.source}</div>
                )}
              </div>

              <div className="d-grid mt-4">
                <button
                  type="submit"
                  className="btn btn-success btn-lg d-flex align-items-center justify-content-center"
                >
                  <MdSave className="me-2" />
                  {isEditMode ? "Update Income" : "Save Income"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddIncome;
