import "./loginRegister.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


interface TokenPayload {
    unique_name?: string;
    role?: string;
    [key: string]: any;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setErrorMsg("");

    fetch("http://localhost:5271/api/Auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    .then(res => {
      if (!res.ok) throw new Error("Fel användarnamn eller lösenord");
      return res.json();
    })
    .then(data => {
      const token = data.token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode<TokenPayload>(token);
      const user = {
          email: decoded.unique_name ?? "",
          isAdmin: decoded.role === "Admin"
      };

      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // Trigger custom event to update navbar
      window.dispatchEvent(new Event("userUpdated"));

      // Clear inputfields
      setEmail("");
      setPassword("");

      navigate("/");
    })
    .catch(error => {
      console.error("Login error:", error);
      setEmail("");
      setPassword("");
      setErrorMsg(error.message);
    });
  }

  return (
    <div className="main-content">
      {errorMsg && <p className="error-msg">{errorMsg}</p>}
      <div className="login-container">
        <h2>Logga in</h2>
        <div className="login-form">
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Lösenord:</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">Logga in</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
