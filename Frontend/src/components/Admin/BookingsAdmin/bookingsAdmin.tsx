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

const BookingsAdmin = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // ✅ lägg till error-state

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

        const mapped = data.map((b: any) => ({
          bookingId: b.bookingId,
          resourceName: `Resurs #${b.resourceId}`, // placeholder
          memberName: `User #${b.userId}`,         // placeholder
          date: new Date(b.startTime).toLocaleDateString(),
          time: `${new Date(b.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${new Date(b.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
        }));

        setBookings(mapped);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Något gick fel"); // ✅ funkar nu
      } finally {
        setLoading(false);
      }
    };

    fetchBookings(); // ✅ nu körs funktionen
  }, []);

  if (loading) return <LoadingSpinner />;
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
          {bookings.length > 0 ? (
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
