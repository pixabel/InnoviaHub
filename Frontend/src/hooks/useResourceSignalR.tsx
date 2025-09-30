import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import resourceConnection from "../services/signalRResourceConnection";

export interface ResourceUpdate {
  resourceId: number;
  resourceName: string;
  updateType: string;
}

const handlerMap = new WeakMap<typeof resourceConnection, boolean>();
const subscribers: ((update: ResourceUpdate) => void)[] = [];
const broadcast = (update: ResourceUpdate) => {
  subscribers.forEach(cb => cb(update));
};

const isConnectedRef = { current: false };

const useResourceSignalr = (callback: (update: ResourceUpdate) => void, source = "unknown") => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    subscribers.push(callbackRef.current);

    const startConnection = async () => {
      if (!handlerMap.get(resourceConnection)) {
        resourceConnection.on("ReceiveResourceUpdate", broadcast);
        handlerMap.set(resourceConnection, true);
      }

      // Start only if disconnected!
      if (resourceConnection.state === signalR.HubConnectionState.Disconnected) {
        try {
          await resourceConnection.start();
          isConnectedRef.current = true;
          console.log("✅ Resource SignalR connected");
        } catch (err) {
          console.error("❌ Resource SignalR connection error:", err);
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

export default useResourceSignalr;