import "./bookingFlow.css";
import StepBar from "./stepBar";
import { useState } from "react";
import { BASE_URL } from "../../config";
import LoadingSpinner from "../loading/loadingComponent";

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

interface ConfirmBookingProps {
  selectedResourceName: string;
  selectedResourceId: number;
  selectedDate: Date;
  selectedTimeslot: Timeslot;
  onReturn: () => void;
  user: User;
  refreshTimeslots: () => void; 
}

const ConfirmBooking = ({
  onReturn,
  selectedResourceName,
  selectedResourceId,
  selectedDate,
  selectedTimeslot,
  user,
  refreshTimeslots
}: ConfirmBookingProps) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  // gets correct bookingTypeNumber for resource
  const getBookingTypeForResource = (resourceId: number) => {
    switch (resourceId) {
      case 1: return 0; // MeetingRoom
      case 2: return 1; // Desk
      case 3: return 2; // VRHeadset
      case 4: return 3; // AIServer
      default: return 0;
    }
  };

  const CompleteBooking = () => {
    setLoading(true); // start spinner
    
    const bookingData = {
      resourceId: selectedResourceId,
      bookingType: getBookingTypeForResource(selectedResourceId),
      startTime: new Date(selectedTimeslot.startTime + "Z").toISOString(),
      endTime: new Date(selectedTimeslot.endTime + "Z").toISOString(),
      userId: user.id
    };

    fetch(`${BASE_URL}/Booking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    })
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 409) {
            throw new Error("Denna tid är redan bokad");
          }
          throw new Error("Något gick fel vid bokning");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Bokning skapad: ", data);
        setShowConfirmation(true);
        refreshTimeslots();
      })
      .catch((err) => {
        alert(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="mainContentConfirmBooking">
      <StepBar currentStep={3} />
      <div className="confirmBooking">
        <h1 className="componentHeader">Bekräfta bokning</h1>
        
        <div className="bookingInfo">
          <p>Bokningen avser: <b>{selectedResourceName}</b></p>
          <p>Datum för bokning: <b>{selectedDate.toLocaleDateString()}</b></p>
          <p>
            Tid för bokning:{" "}
            <b>
              {new Date(selectedTimeslot.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              -{" "}
              {new Date(selectedTimeslot.endTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </b>
          </p>
          <p>
            Bokat på: <b>{user ? `${user.firstName} ${user.lastName}` : "Okänd användare"}</b>
          </p>
        </div>

        {/* Visa spinner medan bokningen skickas */}
        {loading ? (
          <div className="loadingContainerConfirmBooking">
            <LoadingSpinner />
          </div>
        ) : showConfirmation ? (
          <div className="confirmation-popup">
            <p>Bokningen är skapad!</p>
            <button
              onClick={() => {
                setShowConfirmation(false);
                onReturn();
              }}
            >
              Stäng
            </button>
          </div>
        ) : (
          <button className="continueBtn" onClick={CompleteBooking}>
            Bekräfta
          </button>
        )}

        <button className="goBackBtn" onClick={onReturn}>
          Tillbaka
        </button>
      </div>
    </div>
  );
};

export default ConfirmBooking;
