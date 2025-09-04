import Header from "../../components/header/header";
import Navbar from "../../components/navbar/navbar";
import "../../pages/startPage/startPage.css";
const bookingPage = () => {
  return (
    <div className="bookingPage">
      <div className="headerAndNav">
        <Header />
        <Navbar />
      </div>
      <div className="mainContent">
        <h1>Book a resource</h1>
      </div>
    </div>
  );
};

export default bookingPage;
