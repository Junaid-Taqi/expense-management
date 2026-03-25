import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile, clearError } from "../../store/slices/authSlice";
import { MdPerson, MdEmail, MdLock, MdSave, MdCheckCircle } from "react-icons/md";

const Profile = () => {
  const dispatch = useDispatch();
  const { userInfo, loading, error } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
    return () => dispatch(clearError());
  }, [userInfo, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      const resultAction = await dispatch(updateUserProfile({ name, email, password }));
      if (updateUserProfile.fulfilled.match(resultAction)) {
        setSuccess(true);
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => setSuccess(false), 3000);
      }
    }
  };

  return (
    <div className="container-fluid py-2">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="table-container p-4 p-md-5">
            <h4 className="mb-4 text-gradient d-flex align-items-center">
              <MdPerson className="me-2" /> User Profile
            </h4>

            {message && (
              <div className="alert alert-danger py-2 px-3 mb-4 rounded-3 small">
                {message}
              </div>
            )}
            {error && (
              <div className="alert alert-danger py-2 px-3 mb-4 rounded-3 small">
                {error}
              </div>
            )}
            {success && (
              <div className="alert alert-success py-2 px-3 mb-4 rounded-3 d-flex align-items-center small">
                <MdCheckCircle className="me-2" size={18} />
                Profile Updated Successfully!
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <MdPerson className="text-primary" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0 bg-light"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <MdEmail className="text-primary" />
                  </span>
                  <input
                    type="email"
                    className="form-control border-start-0 bg-light"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">New Password (leave blank to keep current)</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <MdLock className="text-primary" />
                  </span>
                  <input
                    type="password"
                    className="form-control border-start-0 bg-light"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-muted">Confirm New Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <MdLock className="text-primary" />
                  </span>
                  <input
                    type="password"
                    className="form-control border-start-0 bg-light"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center fw-bold"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                ) : (
                  <MdSave className="me-2" />
                )}
                Update Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
