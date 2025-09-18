import { useEffect, useState } from "react";
import "./bookingsAdmin.css";
import { BASE_URL } from "../../../config";

type Booking = {
  bookingId: number;
  resourceName: string;
  memberName: string;
  date: string;
  time: string;
};

const BookingsAdmin = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetch(`${BASE_URL}/adminbookings`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // om JWT används
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Fel vid hämtning av bokningar");
        }
        return res.json();
      })
      .then((data) => {
        const mapped = data.map((b: any) => ({
          bookingId: b.bookingId,
          resourceName: `Resurs #${b.resourceId}`, // placeholder tills backend returnerar namn
          memberName: `User #${b.userId}`, // placeholder tills backend returnerar namn
          date: new Date(b.startTime).toLocaleDateString(),
          time: `${new Date(b.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${new Date(b.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
        }));
        setBookings(mapped);
      })
      .catch((err) => console.error(err));
  }, []);

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