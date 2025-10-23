import { useEffect, useRef } from "react";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";

// defined types for Measurement and Alert
// to be used in the callbacks
// measurement being received from SignalR hub when a new measurement is available
type Measurement = {
  tenantSlug: string;
  deviceId: string;
  type: string;
  value: number;
  time: string;
  unit?: string;
};

// alert being received from SignalR hub when an alert is raised
// not working yet
type Alert = {
  tenantId: string;
  deviceId: string;
  type: string;
  value: number;
  time: string;
  ruleId: string;
  severity: string;
  message: string;
};

// custom hook to manage SignalR connection for IoT telemetry 
// used in IoTDeviceList component to receive real-time measurements and later also alerts
export function useIoTSignalR(
  onMeasurementReceived: (measurement: Measurement) => void,
  tenantSlug: string,
  onAlertReceived?: (alert: Alert) => void 
) {
  // useRef to hold the HubConnection instance
  // ensures the connection persists across re-renders
  const connectionRef = useRef<HubConnection | null>(null);

  // useEffect to set up and clean up the SignalR connection
  useEffect(() => {
    // create a new HubConnection using the HubConnectionBuilder
    const connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5103/hub/telemetry")
      .withAutomaticReconnect()
      .build();

    // stores the connection 
    connectionRef.current = connection;

    // start the connection
    // makes sure to only send for the specified tenant 
    connection
      .start()
      .then(() => {
        connection.invoke("JoinTenant", tenantSlug);
      })
      .catch(console.error);

    // listen for measurementReceived events from the hub
    connection.on("measurementReceived", (measurement: Measurement) => {
      onMeasurementReceived(measurement);
    });

    // listen for alertRaised events from the hub if a callback is provided
    // not yet implemented fully
    if (onAlertReceived) {
      connection.on("alertRaised", (alert: Alert) => {
        onAlertReceived(alert);
      });
    }

    // cleanup function to stop the connection and remove event listeners
    // prevents memory leaks and unwanted behavior
    return () => {
      connection.off("measurementReceived");
      connection.off("alertRaised");
      connection.stop();
    };
    // dependencies array to re-run the effect if any dependencies change 
  }, [tenantSlug, onMeasurementReceived, onAlertReceived]);
}