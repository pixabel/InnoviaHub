import "./loginRegister.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { BASE_URL } from "../../../config";

interface TokenPayload {
  sub: string;
  unique_name?: string;
  given_name?: string;
  family_name?: string;
  role?: string;
  [key: string]: any;
}

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  async function handleRegister(event: React.FormEvent) {
    event.preventDefault();
    setErrorMsg("");

    try {
      const res = await fetch(`${BASE_URL}/Auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Registreringen misslyckades");
      }

      const registerData = await res.json();

      // If backend sends token right away
      let token = registerData.token;
      if (!token) {
        // Else login automatic
        const loginRes = await fetch(`${BASE_URL}/Auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!loginRes.ok) {
          throw new Error("Kunde inte logga in automatiskt");
        }

        const loginData = await loginRes.json();
        token = loginData.token;
      }

      localStorage.setItem("token", token);

      // Decode token to get userId
      const decoded = jwtDecode<TokenPayload>(token);
      const user = {
        id: decoded.sub,
        firstName: decoded.given_name ?? firstName,
        lastName: decoded.family_name ?? lastName,
        email: decoded.unique_name ?? email,
        isAdmin: decoded.role === "Admin",
      };

      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("userUpdated"));

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");

      navigate("/");
    } catch (error: any) {
      console.error("Problem vid registrering/inloggning:", error);
      setErrorMsg(error.message || "Något gick fel");
    }
  }

  return (
    <div className="main-content">
      {errorMsg && <p className="error-msg">{errorMsg}</p>}
      <div className="register-container">
        <h2>Skapa konto</h2>
        <div className="register-form">
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="firstName">Förnamn:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <label htmlFor="lastName">Efternamn:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <label htmlFor="email">E-post:</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
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
            <button id="registerBtn" type="submit">
              Skapa konto
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
