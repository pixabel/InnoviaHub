import { useEffect, useState } from "react";
import "./myBookings.css";
import UnBookBtn from "./unBookBtn";
import { BASE_URL } from "../../config";
import LoadingSpinner from "../loading/loadingComponent";
import "../../components/loading/loadingStyle.css";

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

  const resourceTypeColors: { [key: string]: string } = {
    "Mötesrum": "#ffd3a0de",
    "Skrivbord": "#8ec4cdde",
    "VR-Headset": "#a48fb5de",
    "AI-Server": "#6BCB77de",
  };

  const getResourceColor = (resourceName: string) => {
    if (resourceName.includes("Mötesrum")) return resourceTypeColors["Mötesrum"];
    if (resourceName.includes("Skrivbord")) return resourceTypeColors["Skrivbord"];
    if (resourceName.includes("VR")) return resourceTypeColors["VR-Headset"];
    if (resourceName.includes("AI")) return resourceTypeColors["AI-Server"];
    return "#6a3333ff";
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log(user);
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      const fetchBookings = async () => {
        try {
          const res = await fetch(`${BASE_URL}Booking/user/${parsedUser.id}`);
          if (!res.ok) throw new Error("Kunde inte hämta bokningar");

          const data = await res.json();
          const sorted = data.sort(
            (a: Booking, b: Booking) =>
              new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          );
          setBookings(sorted);
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

  return (
    <div className={`mainContentMyBookings ${className || ""}`}>
      <h1 className="myBookingsHeader">Mina bokningar</h1>
      <h2 className="h2">Här hittar du dina bokningar</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading && (
        <div className="loadingContainerMyBookings">
          <LoadingSpinner />
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <p>Du har inga bokningar för tillfället</p>
      )}

      {!loading && !error && bookings.length > 0 && (
        <ul className="myBookedResources">
          {bookings.map((booking) => {
            const color = getResourceColor(booking.resourceName);

            return (
              <li
                key={booking.bookingId}
                className="bookedResourceItem">
                <div
                  style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                  <span
                    style={{
                      backgroundColor: color,
                      color: "black",
                      padding: "0.3em 0.8em",
                      borderRadius: "1em",
                      fontSize: "1em",
                      fontWeight: 500,
                      marginLeft: "-1.5em",
                      marginBottom: "1em",
                      whiteSpace: "nowrap",
                      border: "1px solid black",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.47)"
                    }}
                  >
                    {booking.resourceName.includes("Skrivbord")
                      ? "Skrivbord"
                      : booking.resourceName.includes("Mötesrum")
                      ? "Mötesrum"
                      : booking.resourceName.includes("VR")
                      ? "VR-Headset"
                      : booking.resourceName.includes("AI")
                      ? "AI-Server"
                      : "Okänd"}
                  </span>
                </div>

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
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MyBookingsComponent;

