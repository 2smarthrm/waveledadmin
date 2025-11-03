//   
import axios from "axios";
import React, { useState } from "react";
import { Alert, Button, Spinner } from "react-bootstrap";
import { FiFacebook, FiGithub, FiTwitter } from "react-icons/fi"; 
const API_BASE = "http://localhost:4000";

const LoginForm = ({ onLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setErr("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password }, 
        {withCredentials: true, headers: { "Content-Type": "application/json" },});
      if (res.data?.ok && res.data?.data?.authenticated) {
        onLoggedIn(
          res.data.data.user || {
            email,
            role: res.data.data.role,
            name: res.data.data.name,
          }
        );
      } else if (res.data?.ok) {
        onLoggedIn({
          email,
          role: res.data.data.role,
          name: res.data.data.name,
        });
      } else {
        setErr(res.data?.error || "Falha no login");
      }
    } catch (e) {
      setErr(e?.response?.data?.error || e.message || "Erro de rede");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="fs-20 fw-bolder mb-4">Login</h2>
      <h4 className="fs-13 fw-bold mb-2">Digite as suas crédencias para aceder ao seu menu.</h4>
      {err && <Alert variant="danger">{err}</Alert>}
      <form onSubmit={handleSubmit} className="w-100 mt-4 pt-2">
        <div className="mb-4">
          <input className="form-control" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="" autoFocus  required  />
        </div>
        <div className="mb-3">
          <input  className="form-control"  type="password"  value={password}  onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required  />
        </div>
        <div className="d-flex align-items-center justify-content-between"> 
          <div>
            <div className="custom-control custom-checkbox">
              <input type="checkbox"  className="custom-control-input" id="rememberMe" /> 
              <label   className="custom-control-label c-pointer"  htmlFor="rememberMe"  >
                lembrar sempre
              </label>
            </div> 
          </div>
        </div>
        <div className="mt-3">
          <Button type="submit" className="col col-lg-12" disabled={loading}>
            {loading ? <Spinner size="sm" animation="border" /> : "Entrar"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
