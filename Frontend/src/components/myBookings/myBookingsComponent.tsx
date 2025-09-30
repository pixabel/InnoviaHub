import { useEffect, useState } from "react";
import "./myBookings.css";
import UnBookBtn from "./unBookBtn";
import { BASE_URL } from "../../config";
import LoadingSpinner from "../loading/loadingComponent";
import { FaDesktop, FaVrCardboard, FaServer, FaDoorOpen } from "react-icons/fa";
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

interface MyBookingsProps {
  className?: string;
}

const getResourceIcon = (resourceName: string) => {
  if (resourceName.includes("Mötesrum")) return <FaDoorOpen size={32} color="#F7A072" />;
  if (resourceName.includes("Skrivbord")) return <FaDesktop size={32} color="#61988E" />;
  if (resourceName.includes("VR")) return <FaVrCardboard size={32} color="#A48FB5" />;
  if (resourceName.includes("AI")) return <FaServer size={32} color="#6BCB77" />;
  return <FaDesktop size={32} color="#333" />;
};

const getResourceLabel = (resourceName: string) => {
  if (resourceName.includes("Skrivbord")) return "Skrivbord";
  if (resourceName.includes("Mötesrum")) return "Mötesrum";
  if (resourceName.includes("VR")) return "VR-Headset";
  if (resourceName.includes("AI")) return "AI-Server";
  return "Okänd";
};

const MyBookingsComponent = ({ className }: MyBookingsProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

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
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message || "Något gick fel");
          } else {
            setError("Något gick fel");
          }
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
        <div className="myBookedResources">
          {bookings.map((booking) => (
            <div key={booking.bookingId} className="bookedResourceItem">
              <div className="bookedCardHeader">
                <div className="resourceIcon">{getResourceIcon(booking.resourceName)}</div>
                <div className="resourceTitle">{getResourceLabel(booking.resourceName)}</div>
              </div>
              <div className="bookedCardBody">
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
                <UnBookBtn
                  bookingId={booking.bookingId}
                  onDeleted={() => handleDeleted(booking.bookingId)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsComponent;