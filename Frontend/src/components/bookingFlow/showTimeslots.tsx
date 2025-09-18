import { useEffect, useState } from "react";
import "./timeslots.css";
import useSignalr from "../../hooks/useSignalR";
import { BASE_URL } from "../../../src/config";
import LoadingSpinner from "../loading/loadingComponent";

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
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchTimeslots();
  }, [resourceId, date]);

  const fetchTimeslots = () => {
    if (!resourceId || !date) return;

    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

    setLoading(true);
    fetch(`${BASE_URL}/Timeslot/resources/${resourceId}/timeslots?date=${formattedDate}`)
      .then((res) => {
        if (!res.ok) throw new Error("Kunde inte hämta lediga tider");
        return res.json();
      })
      .then((data) => setTimeslots(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useSignalr((message: any) => {
    if (
      message.resourceId === resourceId &&
      new Date(message.date).toDateString() === date.toDateString()
    ) {
      fetchTimeslots();
    }
  });

  return (
    <div>
      <h2>Tillgängliga tider:</h2>

      {loading && (
        <div className="loading-container">
          <LoadingSpinner />
        </div>
      )}

      {!loading && error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && (
        <ul className="timeslotHolder">
          {timeslots.map((slot) => {
            const start = new Date(slot.startTime);
            const end = new Date(slot.endTime);
            const isSelected = selectedTimeslot?.timeslotId === slot.timeslotId;
            const isDisabled = slot.isBooked;

            return (
              <li
                key={slot.timeslotId}
                className={`timeslotItem ${isSelected ? "selected" : ""} ${
                  isDisabled ? "booked" : ""
                }`}
                onClick={() => {
                  if (!isDisabled) setSelectedTimeslot(slot);
                }}
              >
                {start.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "Europe/Stockholm",
                })}{" "}
                -{" "}
                {end.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "Europe/Stockholm",
                })}{" "}
                {isDisabled && " (Bokad)"}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ShowAvailableTimeslots;
