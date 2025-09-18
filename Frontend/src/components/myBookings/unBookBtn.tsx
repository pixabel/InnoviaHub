import "./myBookings.css";
import { BASE_URL } from "../../config";

interface UnBookBtnProps {
  bookingId: number;
  onDeleted?: () => void;
}

const UnBookBtn = ({bookingId, onDeleted}: UnBookBtnProps) => {
    const unBook = async () => {
     try {
      const response = await fetch(`${BASE_URL}/Booking/${bookingId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.log(response, bookingId);
        throw new Error("Kunde inte ta bort bokning");
      }

      if (onDeleted) onDeleted();
    } catch (err) {
      console.error(err);
      alert("Något gick fel vid avbokning");
    }
  }
  return(
    <button onClick={unBook} className="unBookBtn">
      Avboka
    </button>
  );

}

export default UnBookBtn;