import Header from "../../components/header/header";
import Navbar from "../../components/navbar/navbar";
import OverviewCard from "../../components/dashboard/overview";
import BookingCard from "../../components/dashboard/booking";
//Only to test login and register component
import Login from "../../components/login/register/login";
import Register from "../../components/login/register/register";
//----------------------------
import "./startPage.css";


const StartPage = () => {

  return (
    <div className="startPage">
      <div className="headerAndNav">
        <Header />
        <Navbar />
      </div>
      <div className="mainContent">
        {/* will be moved later   */}
        <div className="loginRegister">
          <Register />
          <Login />
        </div>
        {/* ----------------- */}
        <div className="dashboard">
          <OverviewCard />
          <BookingCard />
        </div>
      </div>
    </div>
  );
};

export default StartPage;
