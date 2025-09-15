import Header from "../../components/header/header";
import Navbar from "../../components/navbar/navbar";
import OverviewCard from "../../components/dashboard/overview";
// import BookingCard from "../../components/dashboard/booking";
import "./startPage.css";
import MyBookingsComponent from "../../components/myBookings/myBookingsComponent";
import { useState, useEffect } from "react";

// Interface for user
interface User {
  email: string;
  isAdmin: boolean;
}

const StartPage = () => {
  const [user, setUser] = useState<User | null>(null);

 useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Listen tu custom event for logout
    const handleUserUpdated = () => setUser(null);
    window.addEventListener("userUpdated", handleUserUpdated);

    return () => {
      window.removeEventListener("userUpdated", handleUserUpdated);
    };
  }, []);


  return (
    <div className="startPage">
      <div className="headerAndNav">
        <Header />
        <Navbar />
      </div>
      <div className="mainContent">
        <div className="dashboard">
          <OverviewCard />
          
          {/* Show only if user is signed in*/}
          {user && (
            <div className="myBookings">
              <MyBookingsComponent />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default StartPage;
