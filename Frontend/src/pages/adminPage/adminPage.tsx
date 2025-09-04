import Header from "../../components/header/header";
import Navbar from "../../components/navbar/navbar";
import "../../pages/startPage/startPage.css";

const adminPage = () => {
  return (
    <div className="adminPage">
      <div className="headerAndNav">
        <Header />
        <Navbar />
      </div>
      <div className="mainContent">
        <h1>Admin Page</h1>
      </div>
    </div>
  );
};

export default adminPage;
