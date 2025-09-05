import Header from "../../components/header/header";
import Navbar from "../../components/navbar/navbar";
import OverviewCard from "../../components/dashboard/overview";
import BookingCard from "../../components/dashboard/booking";
import "./startPage.css";

const StartPage = () => {
  return (
    <div className="startPage">
      <div className="headerAndNav">
        <Header />
        <Navbar />
      </div>
      <div className="mainContent">     
       <div className="dashboard">
              <OverviewCard />
              <BookingCard />
        </div> 
      </div>
    </div>
  );
};

export default StartPage;
