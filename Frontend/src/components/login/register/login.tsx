import "./loginRegister.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { BASE_URL } from "../../../config";
import LoadingSpinner from "../../loading/loadingComponent";

interface TokenPayload {
  sub: string; // user id (may be stale)
  unique_name?: string;
  given_name?: string;
  family_name?: string;
  role?: string | string[];
  roles?: string | string[];
  [key: string]: any;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Fel användarnamn eller lösenord");

      const data = await res.json();
      const token = data.token;
      localStorage.setItem("token", token);

      // Optional: decode for debugging
      const decoded = jwtDecode<TokenPayload>(token);
      console.log("Decoded token:", decoded);

      // Try to get authoritative user info from backend
      let userObj: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        isAdmin: boolean;
      } | null = null;

      try {
        const meRes = await fetch(`${BASE_URL}Auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (meRes.ok) {
          const me = await meRes.json();
          userObj = {
            id: me.id,
            firstName: me.firstName ?? (decoded.given_name ?? ""),
            lastName: me.lastName ?? (decoded.family_name ?? ""),
            email: me.email ?? (decoded.unique_name ?? email),
            isAdmin: !!me.isAdmin,
          };
        } else {
          console.warn("/Auth/me returned", meRes.status);
        }
      } catch (err) {
        console.warn("Fetching /Auth/me failed, falling back to token claims", err);
      }

      // Fallback to token-decoded info if /me failed or wasn't available
      if (!userObj) {
        const roleClaim =
          decoded.role ??
          decoded.roles ??
          decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
          decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"];

        const hasAdminRole =
          roleClaim === "Admin" ||
          (Array.isArray(roleClaim) && roleClaim.includes("Admin")) ||
          (typeof roleClaim === "string" && roleClaim.toLowerCase() === "admin");

        userObj = {
          id: decoded.sub,
          firstName: decoded.given_name ?? "",
          lastName: decoded.family_name ?? "",
          email: decoded.unique_name ?? email,
          isAdmin: hasAdminRole,
        };
      }

      localStorage.setItem("user", JSON.stringify(userObj));

      // Trigger custom event för navbar
      window.dispatchEvent(new Event("userUpdated"));
      console.log("UserId LOGIN", userObj.id);

      // Clear input fields
      setEmail("");
      setPassword("");

      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      setEmail("");
      setPassword("");
      setErrorMsg(error.message || "Ett fel uppstod vid inloggning");
    } finally {
      setLoading(false);
    }
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