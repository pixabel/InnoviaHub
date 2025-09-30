import { useEffect, useRef } from "react";
import connection from "../services/signalRBookingConnection";

interface SignalRConnection {
  on: (event: string, callback: (update: BookingUpdate) => void) => void;
  start: () => Promise<void>;
  state: string;
  _hasHandler?: boolean;
}

export interface BookingUpdate {
  resourceId: number;
  date: string;
}

// Global list of subscribers
const subscribers: ((update: BookingUpdate) => void)[] = [];

// Broadcast to all subscribers
const broadcast = (update: BookingUpdate) => {
  console.log(`🔔 Broadcasting to ${subscribers.length} subscribers`, update);
  subscribers.forEach(cb => cb(update));
};

// Ref to controll if connection is initiated
const isConnectedRef = { current: false };

const useSignalr = (callback: (update: BookingUpdate) => void, source = "unknown") => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
    subscribers.push(callbackRef.current);

    const conn = connection as SignalRConnection;

    // Add event handler if not already
    if (!conn._hasHandler) {
      conn.on("ReceiveBookingUpdate", broadcast);
      conn._hasHandler = true;
      console.log("📡 SignalR handler registered");
    }

    const startConnection = async () => {
      if (!isConnectedRef.current) {
        if (connection.state !== "Connected") {
          try {
            await connection.start();
            isConnectedRef.current = true;
            console.log("✅ SignalR connected");
            // Trigger dummy event to test
            broadcast({ resourceId: -1, date: new Date().toISOString() });
          } catch (err) {
            console.error("❌ SignalR connection error:", err);
          }
        } else {
          isConnectedRef.current = true;
        }
      }
    };

    startConnection();

    return () => {
      const index = subscribers.indexOf(callbackRef.current);
      if (index !== -1) subscribers.splice(index, 1);
    };
  }, [callback, source]);
};

export default useSignalr;