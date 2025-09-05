import Header from "../../components/header/header";
import Navbar from "../../components/navbar/navbar";
import Login from "../../components/login/register/login";
import Register from "../../components/login/register/register";
import "../../pages/bookingPage/bookResource.css";
import { useEffect, useState } from "react";

interface User {
  email: string;
  isAdmin: boolean;
}

const BookingPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const handleUserUpdate = () => {
      const updated = localStorage.getItem("user");
      setUser(updated ? JSON.parse(updated) : null);
    };

    window.addEventListener("userUpdated", handleUserUpdate);
    return () => window.removeEventListener("userUpdated", handleUserUpdate);
  }, []);
  return (
    <div className="bookingPage">
      <div className="headerAndNav">
        <Header />
        <Navbar />
      </div>
      <div className="mainContent">
        {/* If not signed in, show register or login */}
        {!user ? (
          <div className="loginRegister">
            {showRegister ? (
              <>
                <div className="switchAuth">
                  Har du redan ett konto?
                  {/* switch between login or register */}
                  <button className="switchAuthBtn" onClick={() => setShowRegister(false)}>
                    Logga in
                  </button>
                </div>
                <Register />
              </>
            ) : (
              <>
                <div className="switchAuth">
                  Har du inget konto?
                  {/* switch between login or register */}
                  <button className="switchAuthBtn" onClick={() => setShowRegister(true)}>
                    Skapa konto
                  </button>
                </div>
                <Login />
              </>
            )}
          </div>
        ) : (
          <>
          {/* if signed in, show resources to book */}
            <h1>Boka resurs</h1>
            {/* resourceBookings component below */}
          </>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
