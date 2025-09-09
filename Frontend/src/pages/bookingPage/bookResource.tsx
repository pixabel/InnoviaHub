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
  firstName: string;
  lastName: string;
}

const BookingPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedResource, setSelectedResource] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Fetch user from localStorage when page loads
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

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
        {!user ? (
          <LoginPage />
        ) : (
          <>
            <div className="headerAndNav">
              <Header />
              <Navbar />
            </div>

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
                setSelectedDate={setSelectedDate}
                onContinue={() => setCurrentStep(3)}
                onReturn={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 && selectedDate && (
              <ConfirmBooking
                selectedResource={selectedResource}
                selectedDate={selectedDate}
                onReturn={() => setCurrentStep(2)}
                user={user}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
