import "./loginRegister.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  function handleRegister(event: React.FormEvent) {
    event.preventDefault();
    setErrorMsg("");

    fetch("http://localhost:5271/api/Auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, email, password }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Kunde inte skapa konto");
        }

        return res.json();
      })
      .then((data) => {
        console.log("Konto skapas", data);
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");

        navigate("/");
      })
      .catch((error) => {
        console.error("There was a problem creating account");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");

        setErrorMsg(error.message);
      });
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
                type="firstName"
                id="firstName"
                name="firstName"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <label htmlFor="lastName">Efternamn:</label>
              <input
                type="lastName"
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