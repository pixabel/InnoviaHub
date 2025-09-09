import Header from "../../components/header/header";
import Navbar from "../../components/navbar/navbar";
import LoginPage from "../signInPage/signIn";
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
  // State for which step in booking process user are
  const [currentStep, setCurrentStep] = useState(1);
  // State for which resource user has chosen
  const [selectedResource, setSelectedResource] = useState<string>("");

  // Fetch user from localStorage when page loads
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    // Listen for updates from login/logout
    const handleUserUpdate = () => {
      const updated = localStorage.getItem("user");
      setUser(updated ? JSON.parse(updated) : null);
    };

    window.addEventListener("userUpdated", handleUserUpdate);
    return () => window.removeEventListener("userUpdated", handleUserUpdate);
  }, []);

  return (
    <div className="bookingPage">
      <div className="mainContent">
        {/* If user not signed in, show login/register */}
        {!user ? (
          <LoginPage />
        ) : (
          <>
            <div className="headerAndNav">
              <Header />
              <Navbar />
            </div>
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
                // Send onReturn as prop to send user back to step 1
                onReturn={() => setCurrentStep(1) }
              />
            )}
            {currentStep === 3 && (
              <ConfirmBooking 
              // Send onReturn as prop to send user back to step 2
              onReturn={() => setCurrentStep(2)} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
