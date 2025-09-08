import Login from "../../components/login/register/login";
import Register from "../../components/login/register/register";
import Header from "../../components/header/header";
import Navbar from "../../components/navbar/navbar";
import "../../pages/startPage/startPage.css";
import { useState, useEffect } from "react";

// Interface for user
interface User {
  email: string;
  isAdmin: boolean;
}

const LoginPage = () => {
  // State for if register form should show
  const [showRegister, setShowRegister] = useState(false);
  // State for user
  const [user, setUser] = useState<User | null>(null);

  // Fetch user from localStorage when page loads
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    // Listen to event if user should update
    const handleUserUpdate = () => {
      const updated = localStorage.getItem("user");
      setUser(updated ? JSON.parse(updated) : null);
    };

    window.addEventListener("userUpdated", handleUserUpdate);
    return () => window.removeEventListener("userUpdated", handleUserUpdate);
  }, []);

  return (
    <div className="mainContent">
      <div className="headerAndNav">
        <Header />
        <Navbar />
      </div>

      {/* If user not signed in, show login/register */}
      {!user ? (
        <div className="loginRegister">
          {showRegister ? (
            <>
              <div className="switchAuth">
                Har du redan ett konto?
                <button
                  className="switchAuthBtn"
                  onClick={() => setShowRegister(false)}
                >
                  Logga in
                </button>
              </div>
              <Register />
            </>
          ) : (
            <>
              <div className="switchAuth">
                Har du inget konto?
                <button
                  className="switchAuthBtn"
                  onClick={() => setShowRegister(true)}
                >
                  Skapa konto
                </button>
              </div>
              <Login />
            </>
          )}
        </div>
      ) : (
        <div className="loggedInMessage">
          <h2>Du är redan inloggad som {user.email}</h2>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
