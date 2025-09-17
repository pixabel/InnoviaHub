import { useEffect, useState } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import "./overviewcard.css";

interface ResourceStatus {
  MeetingRoom: number;
  Desk: number;
  VRHeadset: number;
  AIServer: number;
}

const OverviewCard = () => {
  const [status, setStatus] = useState<ResourceStatus>({
    MeetingRoom: 0,
    Desk: 0,
    VRHeadset: 0,
    AIServer: 0,
  });

  useEffect(() => {
    // Hämta initial data från backend
    fetch("http://localhost:5271/api/Booking/ResourceAvailability")
      .then(res => res.json())
      .then(data => setStatus(data))
      .catch(err => console.error(err));

    // Koppla upp SignalR
    const connection: HubConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5271/bookingHub")
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => console.log("Connected to SignalR hub"))
      .catch(err => console.error("SignalR connection error:", err));

    // Lyssna på uppdateringar
    connection.on("RecieveBookingUpdate", () => {
      fetch("http://localhost:5271/api/Booking/ResourceAvailability")
        .then(res => res.json())
        .then(data => setStatus(data))
        .catch(err => console.error(err));
    });

    return () => {
      connection.stop();
    };
  }, []);

  return (
    <div className="overviewCard">
      <h2>Snabb översikt</h2>
      <p>Här får du en snabb översikt över alla lediga skrivbord, mötesrum, VR-headset och AI-servrar.</p>

      <div className="overview-grid">
        <div className="overview-item">
          <h3>Lediga skrivbord</h3>
          <span className="count">{status.Desk}</span>
        </div>

        <div className="overview-item">
          <h3>Lediga AI-servrar</h3>
          <span className="count">{status.AIServer}</span>
        </div>

        <div className="overview-item">
          <h3>Lediga mötesrum</h3>
          <span className="count">{status.MeetingRoom}</span>
        </div>

        <div className="overview-item">
          <h3>Lediga VR-headset</h3>
          <span className="count">{status.VRHeadset}</span>
        </div>
      </div>
    </div>
  );
};

export default OverviewCard;
