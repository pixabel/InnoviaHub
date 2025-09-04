import Header from "../../components/header/header";
import Navbar from "../../components/navbar/navbar";
import "./startPage.css";
const StartPage = () => {
  return (
    <div className="startPage">
      <div className="headerAndNav">
        <Header />
        <Navbar />
      </div>
      <div className="mainContent">
        <h1>Welcome to Innovia Hub startpage</h1>
      </div>
    </div>
  );
};

export default StartPage;
