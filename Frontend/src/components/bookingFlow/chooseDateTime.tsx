import "./bookingFlow.css";
import "./calendar.css";
import StepBar from "./stepBar";
import ShowAvailableTimeslots from "./showTimeslots";
import Calendar from "react-calendar";
import { useState } from "react";

interface ChooseDateTimeProps {
  selectedResourceName: string;
  selectedResourceId: number | null;
  selectedTimeslot: Timeslot | null;
  setSelectedTimeslot: (slot: Timeslot) => void;
  setSelectedDate: (date: Date | null) => void;
  onContinue: () => void;
  onReturn: () => void;
}

type Timeslot = {
  timeslotId: number;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  resourceId: number;
};

const ChooseDateTime = ({
  selectedResourceName,
  selectedResourceId,
  selectedTimeslot,
  setSelectedTimeslot,
  setSelectedDate,
  onContinue,
  onReturn,
}: ChooseDateTimeProps) => {
  const [selectedLocalDate, setSelectedLocalDate] = useState<Date | null>(null);
  
  const continueBookingBtn = () => {
    if (!selectedResourceId || !selectedLocalDate || !selectedTimeslot){
      return;
    }
    setSelectedDate(selectedLocalDate);
    onContinue();
  };

  return (
    <div className="mainContentChooseDateTime">
      <StepBar currentStep={2} />
      <div className="chooseDateTime">
        <h1 className="componentHeader">Välj dag för bokning:</h1>
        <Calendar
          className="calendar"
          onChange={(date) => setSelectedLocalDate(date as Date)}
          value={selectedLocalDate}
        />
        {selectedLocalDate && (
          <div className="infoText">
            <p>
              <b>{selectedResourceName}</b>
              <br />
              <hr />
              Lediga tider för {selectedLocalDate.toLocaleDateString()}:
            </p>
            <ShowAvailableTimeslots
              resourceId={selectedResourceId ?? undefined}
              date={selectedLocalDate}
              selectedTimeslot={selectedTimeslot}
              setSelectedTimeslot={setSelectedTimeslot}
            />
          </div>
        )}
        <button className="continueBtn" onClick={continueBookingBtn}>
          Fortsätt
        </button>
        <button className="goBackBtn" onClick={onReturn}>
          Tillbaka
        </button>
      </div>
    </div>
  );
};

export default ChooseDateTime;
