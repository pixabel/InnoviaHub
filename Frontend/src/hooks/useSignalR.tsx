import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import connection from "../services/signalRConnection";

interface BookingUpdate {
  resourceId: number;
  date: string;
}

const useSignalr = (onBookingUpdate: (update: BookingUpdate) => void) => {
  useEffect(() => {
    const startConnection = async () => {
      try {
        if (connection.state === signalR.HubConnectionState.Disconnected) {
          await connection.start();
          console.log("SignalR connected");
        } else {
          console.log("SignalR already connecting/connected:", connection.state);
        }

        // Remove previous listener
        connection.off("ReceiveBookingUpdate");

        // Add listener
        connection.on("ReceiveBookingUpdate", (update: BookingUpdate) => {
          console.log("Received update:", update);
          onBookingUpdate(update);
        });
      } catch (err) {
        console.error("SignalR connection error:", connection.state, err);
      }
    };

    startConnection();

    return () => {
      connection.off("ReceiveBookingUpdate");
    };
  }, [onBookingUpdate]);
};

export default useSignalr;
