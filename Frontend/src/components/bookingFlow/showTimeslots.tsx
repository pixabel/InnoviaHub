import { useEffect, useState, useCallback, useRef } from "react";
import "./timeslots.css";
import useSignalr from "../../hooks/useSignalR";
import { BASE_URL } from "../../config";

export type Timeslot = {
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
}

const ShowAvailableTimeslots = ({
  resourceId,
  date,
  selectedTimeslot,
  setSelectedTimeslot,
}: ShowAvailableTimeslotsProps) => {
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Definiera fetchTimeslots med useCallback
  const fetchTimeslots = useCallback(() => {
    if (!resourceId || !date) return;

    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

    console.log("🔄 Fetching timeslots for", resourceId, formattedDate);

    fetch(`${BASE_URL}Timeslot/resources/${resourceId}/timeslots?date=${formattedDate}`)
      .then(res => {
        if (!res.ok) throw new Error("Kunde inte hämta lediga tider");
        return res.json();
      })
      .then(data => setTimeslots([...data]))
      .catch(err => setError(err.message));
  }, [resourceId, date]);

  // Skapa en ref för att alltid ha senaste fetchTimeslots
  const fetchTimeslotsRef = useRef(fetchTimeslots);
  useEffect(() => {
    fetchTimeslotsRef.current = fetchTimeslots;
  }, [fetchTimeslots]);

  // Use useSignalr and call fetchTimeslots via ref
  useSignalr((update: any) => {
    console.log("♥️ ShowAvailableTimeslots SignalR callback:", update);
    if (fetchTimeslotsRef.current) {
      fetchTimeslotsRef.current();
    }
  }, `${resourceId}-${date.toDateString()}`);

  useEffect(() => {
    fetchTimeslots();
  }, [fetchTimeslots]);

  return (
    <div>
      <h2>Tillgängliga tider</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul className="timeslotHolder">
        {timeslots.map(slot => {
          const start = new Date(slot.startTime);
          const end = new Date(slot.endTime);
          const isSelected = selectedTimeslot?.timeslotId === slot.timeslotId;
          const isDisabled = slot.isBooked;

          return (
            <li
              key={slot.timeslotId}
              className={`timeslotItem ${isSelected ? "selected" : ""} ${isDisabled ? "booked" : ""}`}
              onClick={() => { if (!isDisabled) setSelectedTimeslot(slot); }}
            >
              {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
              {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{" "}
              {isDisabled && " (Bokad)"}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ShowAvailableTimeslots;