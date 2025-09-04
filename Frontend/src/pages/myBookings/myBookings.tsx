import Header from "../../components/header/header";
import Navbar from "../../components/navbar/navbar";
import "../../pages/startPage/startPage.css";
const myBookings = () => {
    return (
        <div>
            <div className="headerAndNav">
                <Header />
                <Navbar />
            </div>
            <div className="mainContent">
                <h1>My Bookings</h1>
            </div>
        </div>
    )
}
export default myBookings;