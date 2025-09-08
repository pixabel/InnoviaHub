import Header from "../../components/header/header";
import Navbar from "../../components/navbar/navbar";
import Login from "../../components/login/register/login";
import Register from "../../components/login/register/register";
import "../../pages/bookingPage/bookResource.css";
import { useEffect, useState } from "react";
import ChooseResource from "../../components/bookingFlow/chooseResource";
import ChooseDateTime from "../../components/bookingFlow/chooseDateTime";
import ConfirmBooking from "../../components/bookingFlow/confirmBooking";

// Interface for user
interface User {
  email: string;
  isAdmin: boolean;
}

const BookingPage = () => {
  // State for user
  const [user, setUser] = useState<User | null>(null);
  // State for if registerform should show
  const [showRegister, setShowRegister] = useState(false);
  // State for which step in booking process user are
  const [currentStep, setCurrentStep] = useState(1);
  // State for which resource user has chosen
  const [selectedResource, setSelectedResource] = useState<string>("");

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
    <div className="bookingPage">
      <div className="headerAndNav">
        <Header />
        <Navbar />
      </div>

      <div className="mainContent">
        {/* If user nog signed in, show login/register */}
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
          <>
          {/* If user is signed in, show bookingflow */}
            {currentStep === 1 && (
              <ChooseResource
                selectedResource={selectedResource}
                setSelectedResource={setSelectedResource}
                onContinue={() => setCurrentStep(2)}
              />
            )}
            {currentStep === 2 && (
              <ChooseDateTime
                selectedResource={selectedResource}
                setSelectedResource={setSelectedResource}
                onContinue={() => setCurrentStep(3)}
              />
            )}
            {currentStep === 3 && <ConfirmBooking />}
          </>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
