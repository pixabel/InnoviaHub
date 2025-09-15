import Header from "../../components/header/header";
import Navbar from "../../components/navbar/navbar";
import LoginPage from "../signInPage/signIn";

import { useEffect, useState } from "react";
import ChooseResource from "../../components/bookingFlow/chooseResource";
import ChooseDateTime from "../../components/bookingFlow/chooseDateTime";
import ConfirmBooking from "../../components/bookingFlow/confirmBooking";

// Interface för user
interface User {
  id: string;
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
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser({
        id: parsed.id,
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        email: parsed.email,
        isAdmin: parsed.isAdmin,
      });
    }

    const handleUserUpdate = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    window.addEventListener("userUpdated", handleUserUpdate);
    return () => window.removeEventListener("userUpdated", handleUserUpdate);
  }, []);

  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);

  const fetchTimeslots = () => {
    if (!selectedResourceId || !selectedDate) return;

    const formattedDate = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${selectedDate.getDate().toString().padStart(2, "0")}`;

    fetch(`http://localhost:5271/api/Timeslot/resources/${selectedResourceId}/timeslots?date=${formattedDate}`)
      .then((res) => {
        if (!res.ok) throw new Error("Kunde inte hämta lediga tider");
        return res.json();
      })
      .then((data) => setTimeslots(data))
      .catch((err) => console.error(err));
  };

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
                timeslots={timeslots}
                fetchTimeslots={fetchTimeslots}
              />
            )}

            {currentStep === 3 && selectedDate && selectedTimeslot && user && (
              <ConfirmBooking
                selectedResourceName={selectedResourceName}
                selectedResourceId={selectedResourceId!}
                selectedDate={selectedDate!}
                selectedTimeslot={selectedTimeslot!}
                onReturn={() => setCurrentStep(2)}
                user={user!}
                refreshTimeslots={fetchTimeslots}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
