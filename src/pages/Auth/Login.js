import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login, clearError } from '../../store/slices/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    dispatch(login({ email, password }));
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <Card className="shadow-lg border-0">
            <Card.Body className="p-5">
              <h2 className="text-center mb-4 fw-bold">Login</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  ></Form.Control>
                </Form.Group>

                <Form.Group className="mb-4" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  ></Form.Control>
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 py-2 fw-bold"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Sign In'}
                </Button>
              </Form>

              <Row className="py-3 mt-4 text-center">
                <Col>
                  New Customer?{' '}
                  <Link to="/signup" className="text-decoration-none fw-bold">
                    Register
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
