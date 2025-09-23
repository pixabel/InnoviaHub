import "./loginRegister.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { BASE_URL } from "../../../config";
import LoadingSpinner from "../../loading/loadingComponent";

interface TokenPayload {
  sub: string; // user id
  unique_name?: string;
  given_name?: string;
  family_name?: string;
  role?: string;
  [key: string]: any;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setErrorMsg("");
    setLoading(true);

    fetch(`${BASE_URL}Auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Fel användarnamn eller lösenord");
        return res.json();
      })
      .then((data) => {
        const token = data.token;
        localStorage.setItem("token", token);

        const decoded = jwtDecode<TokenPayload>(token);
        console.log("Decoded token:", decoded);

        const user = {
          id: decoded.sub,
          firstName: decoded.given_name ?? "",
          lastName: decoded.family_name ?? "",
          email: decoded.unique_name ?? email,
          isAdmin: decoded.role === "Admin",
        };

        localStorage.setItem("user", JSON.stringify(user));

        // Trigger custom event för navbar
        window.dispatchEvent(new Event("userUpdated"));
        console.log("UserId LOGIN", user.id);

        // Clear input fields
        setEmail("");
        setPassword("");

        navigate("/");
      })
      .catch((error) => {
        console.error("Login error:", error);
        setEmail("");
        setPassword("");
        setErrorMsg(error.message);
      })
      .finally(() => {
        setLoading(false);
      })
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
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {loading && (
              <div className="loadingContainerRegisterLogin">
                <LoadingSpinner />
              </div>
            )}
            <button type="submit">Logga in</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
