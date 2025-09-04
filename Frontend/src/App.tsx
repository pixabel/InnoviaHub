import { Routes, Route } from "react-router-dom";
import StartPage from "./pages/startPage/startPage";
import AdminPage from "./pages/adminPage/adminPage";
import BookingPage from "./pages/bookingPage/bookResource";
import MyBookings from "./pages/myBookings/myBookings";
import NotFoundPage from "./pages/notFoundPage";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/myBookings" element={<MyBookings />} />
        {/* NotFoundPage */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </div>
  );
}

export default App;
