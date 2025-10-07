import type { Resource } from "./chooseResource";
import "./recommendationBox.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";
import { BASE_URL } from "../../../src/config";
import { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

type RecommendationBoxProps = {
  resource: string;
  date: string;
  time: string;
  message: string;
  resources: Resource[];
  setSelectedResourceId: (id: number | null) => void;
  setSelectedResourceName: (name: string) => void;
  onDismiss: () => void;
};

const RecommendationBox = ({
  resource,
  date,
  time,
  message,
  resources,
  setSelectedResourceId,
  setSelectedResourceName,
  onDismiss,
}: RecommendationBoxProps) => {
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBook = async () => {
    setBookingError(null);
    setBookingLoading(true);

    const res = resources.find(r => r.resourceName === resource);
    if (!res) {
      setBookingError("Kunde inte hitta resursen.");
      setBookingLoading(false);
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setBookingError("Ingen användare hittades.");
      setBookingLoading(false);
      return;
    }
    const user = JSON.parse(storedUser);

    // plugin for timezone handling
    const swedenTz = "Europe/Stockholm";
    const [startTimeRaw, endTimeRaw] = time.split("-");
    const startTimeStr = startTimeRaw.trim();
    const endTimeStr = endTimeRaw.trim();
    const startSweden = dayjs.tz(`${date} ${startTimeStr}`, swedenTz);
    const endSweden = dayjs.tz(`${date} ${endTimeStr}`, swedenTz);
    const startDateTime = startSweden.format();
    const endDateTime = endSweden.format();

    let bookingType = 2; 
    if (res.resourceName.toLowerCase().includes("skrivbord")) bookingType = 0;
    else if (res.resourceName.toLowerCase().includes("mötesrum")) bookingType = 1;

    const bookingDTO = {
      userId: user.id,
      resourceId: res.id,
      bookingType,
      startTime: startDateTime,
      endTime: endDateTime,
    };

    try {
      const response = await fetch(`${BASE_URL}Booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingDTO),
      });

      if (!response.ok) {
        const errText = await response.text();
        setBookingError("Kunde inte boka resursen! " + errText);
        setBookingLoading(false);
        return;
      }

      setSelectedResourceId(res.id);
      setSelectedResourceName(res.resourceName);
      setBookingSuccess(true);
      setBookingLoading(false);
    } catch (error) {
      setBookingError("Kunde inte boka resursen!");
      setBookingLoading(false);
      console.error(error);
    }
  };

  return (
    <div className="recommendationBox">
      <span className="starIcon">
        <FontAwesomeIcon icon={farStar} />
      </span>
      <h3>Rekommenderas för dig!</h3>
      <p><strong>Resurs:</strong> {resource || <em>Ingen rekommendation</em>}</p>
      <p><strong>Datum:</strong> {date || <em>Ingen rekommendation</em>}</p>
      <p><strong>Tid:</strong> {time || <em>Ingen rekommendation</em>}</p>
      <p>{message}</p>
      {bookingLoading && <p style={{ color: "blue" }}>Bokar resursen...</p>}
      {bookingError && <p style={{ color: "red" }}>{bookingError}</p>}
      {!bookingSuccess && (
        <div className="recommendationButtons">
          <button onClick={handleBook} disabled={!resource || bookingLoading}>Boka</button>
          <button onClick={onDismiss} disabled={bookingLoading}>Visa fler alternativ</button>
        </div>
      )}
      {bookingSuccess && (
        <div style={{ color: "green", marginTop: "1em" }}>
          Din resurs är bokad! Du kan se din bokning under Mina bokningar.
        </div>
      )}
    </div>
  );
};

export default RecommendationBox;