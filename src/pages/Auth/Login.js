import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import ReCAPTCHA from "react-google-recaptcha";
import { login, clearError } from "../../store/slices/authSlice";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
    return () => {
      dispatch(clearError());
    };
  }, [userInfo, navigate, dispatch]);

  const onCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!captchaValue) {
      alert("Please verify you are not a robot");
      return;
    }
    dispatch(login({ email, password }));
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Login</h2>
          <p>Sign in to manage your finances elegantly</p>
        </div>

        {error && (
          <Alert variant="danger" className="error-alert">
            {error}
          </Alert>
        )}

        <Form onSubmit={submitHandler}>
          <div className="auth-input-group">
            <label className="auth-label">Email Address</label>
            <div className="position-relative">
              <Form.Control
                type="email"
                placeholder="yasin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-input"
              />
              <FiMail className="auth-input-icon" />
            </div>
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Password</label>
            <div className="position-relative">
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input"
              />
              <FiLock className="auth-input-icon" />
              <button
                type="button"
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className="captcha-wrapper mb-4">
            <ReCAPTCHA
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Google Test Key
              onChange={onCaptchaChange}
              theme="light" // Can be dynamic based on your project theme if needed
            />
          </div>

          <Button type="submit" className="w-100 auth-btn" disabled={loading}>
            {loading ? (
              <span className="d-flex align-items-center justify-content-center">
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Logging in...
              </span>
            ) : (
              <span className="d-flex align-items-center justify-content-center">
                Sign In <FiArrowRight className="ms-2" />
              </span>
            )}
          </Button>
        </Form>

        <div className="auth-footer">
          Don't have an account?{" "}
          <Link to="/signup" className="auth-link">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
