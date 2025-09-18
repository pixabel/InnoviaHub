import { useEffect, useState } from "react";
import "./myBookings.css";
import UnBookBtn from "./unBookBtn";
import { BASE_URL } from "../../config";
import LoadingSpinner from "../loading/loadingComponent";
import "../../components/loading/loadingStyle.css"

interface Resource {
  resourceId: number;
  name: string;
  resourceType: number;
}

interface Booking {
  bookingId: number;
  userId: string;
  resourceId: number;
  resourceName: string;
  bookingType: number;
  startTime: string;
  endTime: string;
  dateOfBooking: string;
}

interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  firstName: string;
  lastName: string;
}

interface MyBookingsProps {
  className?: string;
}

const MyBookingsComponent = ({ className }: MyBookingsProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // const resourceNames: { [key: number]: string } = {
  //   1: "Mötesrum",
  //   2: "Skrivbord",
  //   3: "VR-Headset",
  //   4: "AI-Server",
  // };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log(user);
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      const fetchBookings = async () => {
        try {
          const res = await fetch(`${BASE_URL}/Booking/user/${parsedUser.id}`);
          if (!res.ok) throw new Error("Kunde inte hämta bokningar");

          const data = await res.json();
          setBookings(data);
        } catch (err: any) {
          console.error("Error fetching bookings:", err);
          setError(err.message || "Något gick fel");
        } finally {
          setLoading(false);
        }
      };
      fetchBookings();
    } else {
      setLoading(false);
      setError("Ingen användare hittades. Är du inloggad?");
    }
  }, []);

  const handleDeleted = (deletedBookingId: number) => {
    setBookings((prev) => prev.filter((b) => b.bookingId !== deletedBookingId));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formatted = date.toLocaleDateString("sv-SE", {
      weekday: "long",
      day: "numeric",
      month: "numeric",
      timeZone: "Europe/Stockholm",
    });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className={`mainContentMyBookings ${className || ""}`}>
      <h1 className="myBookingsHeader">Mina bokningar</h1>
      <h2 className="h2">Här hittar du dina bokningar</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <p>Du har inga bokningar för tillfället</p>
      )}
      {loading && (
        <div className="loading-container">
          <LoadingSpinner />
        </div>
      )}
      {!loading && !error && bookings.length > 0 && (
        <ul className="myBookedResources">
          {bookings.map((booking) => (
            <li className="bookedResourceItem" key={booking.bookingId}>
              <h3>{booking.resourceName || "Unknown"}</h3>
              <div className="dateTimeInfo">
                <div className="bookingDateTimeInfo">{formatDate(booking.startTime)}</div>
                <div className="bookingDateTimeInfo">
                  {new Date(booking.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Europe/Stockholm",
                  })}
                  -
                  {new Date(booking.endTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Europe/Stockholm",
                  })}
                </div>
              </div>
              <UnBookBtn
                bookingId={booking.bookingId}
                onDeleted={() => handleDeleted(booking.bookingId)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>

  );
};

export default MyBookingsComponent;
