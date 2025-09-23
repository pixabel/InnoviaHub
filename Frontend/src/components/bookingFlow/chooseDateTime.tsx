import "./bookingFlow.css";
import "./calendar.css";
import StepBar from "./stepBar";
import ShowAvailableTimeslots from "./showTimeslots";
import Calendar from "react-calendar";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../src/config";

interface ChooseDateTimeProps {
  selectedResourceName: string;
  selectedResourceId: number | null;
  selectedTimeslot: Timeslot | null;
  setSelectedTimeslot: (slot: Timeslot) => void;
  setSelectedDate: (date: Date | null) => void;
  onContinue: () => void;
  onReturn: () => void;
  timeslots: Timeslot[];
  fetchTimeslots: () => void;
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

  useEffect(() => {
    if (selectedLocalDate) {
      fetchTimeslots();
    }
  }, [selectedLocalDate, selectedResourceId]);

  const continueBookingBtn = () => {
    if (!selectedResourceId || !selectedLocalDate || !selectedTimeslot) {
      return;
    }
    setSelectedDate(selectedLocalDate);
    onContinue();
  };

  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  console.log(timeslots);

  const fetchTimeslots = () => {
    if (!selectedResourceId || !selectedLocalDate) return;

    const formattedDate = `${selectedLocalDate.getFullYear()}-${(selectedLocalDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${selectedLocalDate.getDate().toString().padStart(2, "0")}`;

    fetch(`${BASE_URL}Timeslot/resources/${selectedResourceId}/timeslots?date=${formattedDate}`)
      .then((res) => {
        if (!res.ok) throw new Error("Kunde inte hämta lediga tider");
        return res.json();
      })
      .then((data) => setTimeslots(data))
      .catch((err) => console.error(err))
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
              <b>{selectedLocalDate.toLocaleDateString()} </b>
            </p>
            <hr />

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
