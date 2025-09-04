import "./navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>
          <Link to="/">Startsida</Link>
        </li>
        <li>
          <Link to="/book">Boka Resurser</Link>
        </li>
        <li>
          <Link to="/myBookings">Mina Bokningar</Link>
        </li>
        {/* <div tabIndex={0} role="button" aria-label="Öppna meny" className="menu">
          <i className="fa-solid fa-bars"></i>
        </div> */}
        
        {/* If statement to check if user is admin, if so show admin link
        To be continued... */}
        <li>
            <Link to="/admin">Admin</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
