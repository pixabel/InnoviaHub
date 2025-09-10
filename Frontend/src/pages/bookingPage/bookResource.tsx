import Header from "../../components/header/header";
import Navbar from "../../components/navbar/navbar";
import LoginPage from "../signInPage/signIn";

import { useEffect, useState } from "react";
import ChooseResource from "../../components/bookingFlow/chooseResource";
import ChooseDateTime from "../../components/bookingFlow/chooseDateTime";
import ConfirmBooking from "../../components/bookingFlow/confirmBooking";

// Interface för user
interface User {
  id: number;
  email: string;
  isAdmin: boolean;
  firstName: string;
  lastName: string;
}

export type Timeslot = {
  timeslotId: number;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  resourceId: number;
};

const BookingPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Resource state
  const [selectedResourceId, setSelectedResourceId] = useState<number | null>(
    null
  );
  const [selectedResourceName, setSelectedResourceName] = useState<string>("");

  // Datum + timeslot
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeslot, setSelectedTimeslot] = useState<Timeslot | null>(
    null
  );

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
                selectedResourceId={selectedResourceId}
                setSelectedResourceId={setSelectedResourceId}
                selectedResourceName={selectedResourceName}
                setSelectedResourceName={setSelectedResourceName}
                onContinue={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 2 && selectedResourceId && (
              <ChooseDateTime
                selectedResourceName={selectedResourceName}
                selectedResourceId={selectedResourceId}
                selectedTimeslot={selectedTimeslot}
                setSelectedTimeslot={setSelectedTimeslot}
                setSelectedDate={setSelectedDate}
                onContinue={() => setCurrentStep(3)}
                onReturn={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 && selectedDate && selectedTimeslot && (
              <ConfirmBooking
                selectedResourceName={selectedResourceName}
                selectedResourceId={selectedResourceId!}
                selectedDate={selectedDate!}
                selectedTimeslot={selectedTimeslot!}
                onReturn={() => setCurrentStep(2)}
                user={user!} 
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
