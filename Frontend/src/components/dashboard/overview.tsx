import { useEffect, useState } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import "./overviewcard.css";
import { BASE_URL } from "../../config";
import LoadingSpinner from "../loading/loadingComponent";

const hubUrl = "https://backend20250901141037.azurewebsites.net/bookinghub";

interface ResourceStatus {
  MeetingRooms: boolean[];   // true = available, false = booked
  VRHeadsets: boolean[];
  Desk: number;
  AIServer: number;
}

const MEETING_ROOM_NAMES = ["Mötesrum 1", "Mötesrum 2", "Mötesrum 3", "Mötesrum 4"];
const VR_HEADSET_NAMES = ["VR-headset 1", "VR-headset 2", "VR-headset 3", "VR-headset 4"];

const OverviewCard = () => {
  const [status, setStatus] = useState<ResourceStatus>({
    MeetingRooms: [true, true, true, true], // default all available
    VRHeadsets: [true, true, true, true],   // default all available
    Desk: 0,
    AIServer: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

useEffect(() => {
  setLoading(true);
  fetch(`${BASE_URL}Booking/ResourceAvailability`)
    .then(res => res.json())
    .then(data => setStatus({
      Desk: data.desk ?? 0,
      AIServer: data.aiServer ?? 0,
      MeetingRooms: Array.isArray(data.meetingRooms)
        ? data.meetingRooms
        : [true, true, true, true],
      VRHeadsets: Array.isArray(data.vrHeadsets)
        ? data.vrHeadsets
        : [true, true, true, true]
    }))
    .catch(err => console.error(err))
    .finally(() => setLoading(false));

    const connection: HubConnection = new HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => console.log("Connected to SignalR hub"))
      .catch(err => console.error("SignalR connection error:", err));

    connection.on("RecieveBookingUpdate", () => {
      fetch(`${BASE_URL}Booking/ResourceAvailability`)
        .then(res => res.json())
        .then(data => setStatus({
          Desk: data.Desk ?? 0,
          AIServer: data.AIServer ?? 0,
          MeetingRooms: Array.isArray(data.MeetingRooms)
            ? data.MeetingRooms
            : [true, true, true, true],
          VRHeadsets: Array.isArray(data.VRHeadsets)
            ? data.VRHeadsets
            : [true, true, true, true]
        }))
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
          {loading ? <LoadingSpinner /> : <span className="count">{status.Desk}</span>}
        </div>

        <div className="overview-item">
          <h3>Lediga AI-servrar</h3>
          {loading ? <LoadingSpinner /> : <span className="count">{status.AIServer}</span>}
        </div>

        <div className="overview-item">
          <h3>Lediga mötesrum</h3>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="item-list">
              {MEETING_ROOM_NAMES.map((room, i) => (
                <div key={room} className="item-row">
                  <span>{room}</span>
                  <span className={`status ${(status.MeetingRooms && status.MeetingRooms[i]) ? "available" : "booked"}`}></span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="overview-item">
          <h3>Lediga VR-headset</h3>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="item-list">
              {VR_HEADSET_NAMES.map((vr, i) => (
                <div key={vr} className="item-row">
                  <span>{vr}</span>
                  <span className={`status ${(status.VRHeadsets && status.VRHeadsets[i]) ? "available" : "booked"}`}></span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewCard;