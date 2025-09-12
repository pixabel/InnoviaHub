import { useEffect, useState } from "react";
import "./timeslots.css";
import useSignalr from "../../hooks/useSignalR";

type Timeslot = {
  timeslotId: number;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  resourceId: number;
};

interface ShowAvailableTimeslotsProps {
  resourceId: number | undefined;
  date: Date;
  selectedTimeslot: Timeslot | null;
  setSelectedTimeslot: (slot: Timeslot) => void;
  timeslots: Timeslot[];         
  refreshTimeslots: () => void; 
}

const ShowAvailableTimeslots = ({
  resourceId,
  date,
  selectedTimeslot,
  setSelectedTimeslot,
  timeslots,         
  refreshTimeslots
}: ShowAvailableTimeslotsProps) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    refreshTimeslots();
  }, [resourceId, date]);

  useSignalr((message: any) => {
    if (
      message.resourceId === resourceId &&
      new Date(message.date).toDateString() === date.toDateString()
    ) {
      refreshTimeslots();
    }
  });

  return (
    <div>
      <h2>Tillgängliga tider</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
     
      <ul className="timeslotHolder">
        {timeslots.map((slot) => {
          const start = new Date(slot.startTime);
          const end = new Date(slot.endTime);
          const isSelected = selectedTimeslot?.timeslotId === slot.timeslotId;
          const isDisabled = slot.isBooked;

          return (
            <li
              key={slot.timeslotId}
              className={`timeslotItem ${isSelected ? "selected" : ""} ${isDisabled ? "booked" : ""}`}
              onClick={() => {
                if (!isDisabled) setSelectedTimeslot(slot);
              }}
            >
              {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - 
              {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} 
              {isDisabled && " (Bokad)"}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ShowAvailableTimeslots;
