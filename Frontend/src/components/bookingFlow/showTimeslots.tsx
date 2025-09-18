import { useEffect, useState } from "react";
import "./timeslots.css";
import useSignalr from "../../hooks/useSignalR";
import { BASE_URL } from "../../../src/config";

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
}: ShowAvailableTimeslotsProps) => {
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTimeslots();
  }, [resourceId, date]);

  const fetchTimeslots = () => {
    if (!resourceId || !date) return;

    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

    fetch(`${BASE_URL}/Timeslot/resources/${resourceId}/timeslots?date=${formattedDate}`)
      .then((res) => {
        if (!res.ok) throw new Error("Kunde inte hämta lediga tider");
        return res.json();
      })
      .then((data) => setTimeslots(data))
      .catch((err) => setError(err.message));
  };

  useSignalr((message: any) => {
    if (
      message.resourceId === resourceId &&
      new Date(message.date).toDateString() === date.toDateString()
    ) {
      fetchTimeslots();
    }
  });

  // DEBUG LOGGING
  console.log("Rendered timeslots:", timeslots);

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
              {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Stockholm" })} - 
              {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Stockholm" })} 
              {isDisabled && " (Bokad)"}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ShowAvailableTimeslots;
