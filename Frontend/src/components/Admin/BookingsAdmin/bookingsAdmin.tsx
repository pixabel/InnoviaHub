import { useEffect, useState } from "react";
import "./bookingsAdmin.css";
import { BASE_URL } from "../../../config";
import LoadingSpinner from "../../loading/loadingComponent";

type Booking = {
  bookingId: number;
  resourceName: string;
  memberName: string;
  date: string;
  time: string;
};

// Type to sort bookings
type BookingWithDates = {
  bookingId: number;
  resourceName: string;
  memberName: string;
  startTime: Date;
  endTime: Date;
};

const BookingsAdmin = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/adminbookings`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          throw new Error("Fel vid hämtning av bokningar");
        }

        const data = await res.json();

        // Sort after date and time
        const mapped: Booking[] = data
          .map((b: any) => ({
            bookingId: b.bookingId,
            resourceName: b.resourceName,
            memberName: b.memberName,
            startTime: new Date(b.startTime),
            endTime: new Date(b.endTime),
          } as BookingWithDates))
          .sort(
            (a: BookingWithDates, b: BookingWithDates) =>
              a.startTime.getTime() - b.startTime.getTime()
          )
          .map((b: BookingWithDates) => ({
            bookingId: b.bookingId,
            resourceName: b.resourceName,
            memberName: b.memberName,
            date: b.startTime.toLocaleDateString(),
            time: `${b.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${b.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
          }));


        setBookings(mapped);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Något gick fel");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="adminContainer">
      <h2>Bokningshantering</h2>
      <table className="adminTable">
        <thead>
          <tr>
            <th>Resurs</th>
            <th>Medlem</th>
            <th>Datum</th>
            <th>Tid</th>
            <th>Redigera</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "2rem" }}>
                <div className="loadingContainerBookings">
                  <LoadingSpinner />
                </div>
              </td>
            </tr>
          ) : bookings.length > 0 ? (
            bookings.map((booking) => (
              <tr key={booking.bookingId}>
                <td>{booking.resourceName}</td>
                <td>{booking.memberName}</td>
                <td>{booking.date}</td>
                <td>{booking.time}</td>
                <td className="actions">
                  <button className="editBtn">✏️</button>
                  <button className="deleteBtn">🗑️</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                Inga bokningar hittades
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsAdmin;
