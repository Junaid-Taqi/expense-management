import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiCheckCircle, FiUserPlus } from 'react-icons/fi';
import { register, clearError } from '../../store/slices/authSlice';
import './Auth.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
    return () => {
      dispatch(clearError());
    };
  }, [userInfo, navigate, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      setMessage(null);
      dispatch(register({ name, email, password }));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join us to start tracking your expenses professionally</p>
        </div>

        {message && (
          <Alert variant="danger" className="error-alert">
            {message}
          </Alert>
        )}
        {error && (
          <Alert variant="danger" className="error-alert">
            {error}
          </Alert>
        )}

        <Form onSubmit={submitHandler}>
          <div className="auth-input-group">
            <label className="auth-label">Full Name</label>
            <div className="position-relative">
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="auth-input"
              />
              <FiUser className="auth-input-icon" />
            </div>
          </div>

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
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input"
              />
              <FiLock className="auth-input-icon" />
            </div>
          </div>

          <div className="auth-input-group">
            <label className="auth-label">Confirm Password</label>
            <div className="position-relative">
              <Form.Control
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="auth-input"
              />
              <FiCheckCircle className="auth-input-icon" />
            </div>
          </div>

          <Button
            type="submit"
            className="w-100 auth-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="d-flex align-items-center justify-content-center">
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating account...
              </span>
            ) : (
              <span className="d-flex align-items-center justify-content-center">
                Sign Up <FiUserPlus className="ms-2" />
              </span>
            )}
          </Button>
        </Form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
