import { useEffect } from "react";
import connection from "../services/signalrConnection";

interface BookingUpdate {
  resourceId: number;
  date: string;
}

const useSignalr = (onBookingUpdate: (update: BookingUpdate) => void) => {
  useEffect(() => {
    const startConnection = async () => {
      try {
        if (connection.state === "Disconnected") {
          await connection.start();
          console.log("SignalR connected");
        }

        // Make sure listener is only attached once
        connection.off("RecieveBookingUpdate");
        connection.on("RecieveBookingUpdate", (update: BookingUpdate) => {
          console.log("Received update:", update);
          onBookingUpdate(update);
        });
      } catch (err) {
        console.error("SignalR connection error:", err);
      }
    };

    startConnection();

    return () => {
      connection.off("RecieveBookingUpdate"); // clean up listener
      // optional: connection.stop(); // only if you want to fully stop
    };
  }, [onBookingUpdate]);
};

export default useSignalr;
