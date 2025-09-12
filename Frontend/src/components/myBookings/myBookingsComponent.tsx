import { useEffect, useState } from "react";
import "./myBookings.css";
import UnBookBtn from "./unBookBtn";

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
  className?: string; // 👈 gör className optional
}

const MyBookingsComponent = ({className}: MyBookingsProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
    const [user, setUser] = useState<User | null>(null);
  
    const resourceNames: { [key: number]: string } = {
      1: "Mötesrum",
      2: "Skrivbord",
      3: "VR-Headset",
      4: "AI-Server",
    };
  
    useEffect(() => {
      // Hämta user från localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
  
        // Hämta bokningar för denna user
        fetch(`http://localhost:5271/api/Booking/user/${parsedUser.id}`)
          .then((res) => res.json())
          .then((data) => setBookings(data))
          .catch((err) => console.error("Error fetching bookings:", err));
      }
    }, []);

    // Function to send to UnBookBtn to update list
    const handleDeleted = (deletedBookingId: number) => {
    setBookings((prev) => prev.filter(b => b.bookingId !== deletedBookingId));
  };

     const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const formatted = date.toLocaleDateString("sv-SE", {
        weekday: "long",
        day: "numeric",
        month: "numeric",
      });
      // Show date for booking as e.g Måndag 1/9
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    };
    
    return(
        <div className={`mainContentMyBookings ${className || ""}`}>
        <h1 className="myBookingsHeader">{user?.firstName}s bokningar</h1>
        {bookings.length === 0 ? (
          <p>Du har inga bokningar för tillfället</p>
        ) : (
          <ul className="myBookedResources">
            {bookings.map((booking) => (
              <li className="bookedResourceItem" key={booking.bookingId}>
                <h3>
                  {" "}
                  {resourceNames[booking.resourceId] || "Unknown"}{" "}
                  {booking.resourceId}
                </h3>
                <div className="dateTimeInfo">
                  <div className="bookingDateTimeInfo">
                    {formatDate(booking.startTime)}
                    <br/>
                  </div>
                  <div className="bookingDateTimeInfo">
                    {new Date(booking.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    -
                    {new Date(booking.endTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <UnBookBtn 
                bookingId={booking.bookingId}
                onDeleted={() => handleDeleted(booking.bookingId)}  />
              </li>
            ))}
          </ul>
        )}
      </div>
    );
}

export default MyBookingsComponent;