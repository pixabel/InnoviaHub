import Header from "../components/header/header";
import Navbar from "../components/navbar/navbar";
import "../pages/startPage/startPage.css";
function NotFoundPage() {
  return (
    <div>
      <div className="headerAndNav">
        <Header />
        <Navbar />
      </div>
      <div style={{ textAlign: "center", marginTop: "5rem", fontFamily: "Inter, sans-serif" }}>
        <h1>404</h1>
        <p>Sidan du letar efter finns inte.</p>
         <div style={{ width: "120px", margin: "0 auto 1rem" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            width="100%"
            height="100%"
          >
            {/* Kropp */}
            <rect x="14" y="22" width="36" height="30" rx="6" fill="#cfd8dc" stroke="#333" strokeWidth="2"/>
            
            {/* Huvud */}
            <rect x="18" y="8" width="28" height="18" rx="4" fill="#eceff1" stroke="#333" strokeWidth="2"/>
            
            {/* Ögon */}
            <circle cx="26" cy="17" r="3" fill="#333"/>
            <circle cx="38" cy="17" r="3" fill="#333"/>
            
            {/* Antenn */}
            <line x1="32" y1="4" x2="32" y2="8" stroke="#333" strokeWidth="2"/>
            <circle cx="32" cy="3" r="2" fill="#f44336"/>
            
            {/* Armar */}
            <rect x="8" y="26" width="6" height="16" rx="3" fill="#b0bec5" stroke="#333" strokeWidth="1"/>
            <rect x="50" y="26" width="6" height="16" rx="3" fill="#b0bec5" stroke="#333" strokeWidth="1"/>
            
            {/* Ben */}
            <rect x="22" y="52" width="6" height="8" fill="#90a4ae" stroke="#333" strokeWidth="1"/>
            <rect x="36" y="52" width="6" height="8" fill="#90a4ae" stroke="#333" strokeWidth="1"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
