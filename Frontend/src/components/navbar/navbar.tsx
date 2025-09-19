// Navbar.tsx
import "./navbar.css";
import SignOutBtn from "../login/register/signOut";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<{ isAdmin: boolean; email: string } | null>(
    null
  );
  const updateUser = () => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    setIsAdmin(user?.isAdmin ?? false);
    setUser(parsedUser);
  };

  useEffect(() => {
    // Update navbar when page reloads
    updateUser();

    // Listen to custom event
    const listener = () => updateUser();
    window.addEventListener("userUpdated", listener);

    // Cleanup
    return () => window.removeEventListener("userUpdated", listener);
  }, []);

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>
          <Link to="/">Startsida</Link>
        </li>
        <li>
          <Link to="/book">Boka Resurser</Link>
        </li>
        {!user ? (
          <li>
            <Link to="/login">
              <i className="fa-solid fa-right-to-bracket loginBtn"></i>
            </Link>
          </li>
        ) : (
          <>
            <li>
              <Link to="/myBookings">Mina Bokningar</Link>
            </li>
            {isAdmin && (
              <li>
                <Link to="/admin/members">Admin</Link>
              </li>
            )}
            <li>
              <SignOutBtn />
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
