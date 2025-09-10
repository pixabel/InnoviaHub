import Header from "../../components/header/header";
import Navbar from "../../components/navbar/navbar";
import MyBookingsComponent from "../../components/myBookings/myBookingsComponent";
import "../../pages/startPage/startPage.css";


const MyBookingsPage = () => {
 
  return (
    <div>
      <div className="headerAndNav">
        <Header />
        <Navbar />
      </div>
        <MyBookingsComponent />
    </div>
  );
};

export default MyBookingsPage;
