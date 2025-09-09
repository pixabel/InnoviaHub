import "./bookingFlow.css";
import "./calendar.css";
import StepBar from "./stepBar";
import Calendar from "react-calendar";
import { useState } from "react";

interface ChooseDateTimeProps {
  selectedResource: string;
  setSelectedResource: (id: string) => void;
  setSelectedDate: (date: Date | null) => void; // ny prop
  onContinue: () => void;
  onReturn: () => void;
}

const ChooseDateTime = ({ selectedResource, setSelectedDate, onContinue, onReturn }: ChooseDateTimeProps) => {
  const [selectedLocalDate, setSelectedLocalDate] = useState<Date | null>(null);

  const continueBookingBtn = () => {
    if (!selectedResource || !selectedLocalDate) return;
    setSelectedDate(selectedLocalDate); // skicka datum uppåt
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
            <p><b>{selectedResource}</b><br/>
            <hr/>
            Lediga tider för {selectedLocalDate.toLocaleDateString()}:</p>
          </div>
        )}
        <button className="continueBtn" onClick={continueBookingBtn}>
          Fortsätt
        </button>
        <button className="goBackBtn" onClick={onReturn}>Tillbaka</button>
      </div>
    </div>
  );
};

export default ChooseDateTime;
