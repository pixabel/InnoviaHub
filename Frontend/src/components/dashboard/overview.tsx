import { useEffect, useState } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import "./overviewcard.css";
import { BASE_URL } from "../../config";
import LoadingSpinner from "../loading/loadingComponent";

const hubUrl = "https://backend20250901141037.azurewebsites.net/bookinghub";

interface ResourceStatus {
  meetingRooms: boolean[];
  vrHeadsets: boolean[];
  desk: number;
  aiServer: number;
}

const MEETING_ROOM_NAMES = ["Mötesrum 1", "Mötesrum 2", "Mötesrum 3", "Mötesrum 4"];
const VR_HEADSET_NAMES = ["VR-headset 1", "VR-headset 2", "VR-headset 3", "VR-headset 4"];

const OverviewCard = () => {
  const [status, setStatus] = useState<ResourceStatus>({
    meetingRooms: [true, true, true, true],
    vrHeadsets: [true, true, true, true],
    desk: 0,
    aiServer: 0,
  });

  const [loading, setLoading] = useState<boolean>(true);

  const fetchResourceData = () => {
    setLoading(true);
    fetch(`${BASE_URL}Booking/ResourceAvailability`)
      .then(res => res.json())
      .then(data => {
        console.log("Fetched resource data:", data);

        const totalMeetingRooms = MEETING_ROOM_NAMES.length;
        const totalVRHeadsets = VR_HEADSET_NAMES.length;

        // Skapa array med boolean där true = ledig, false = bokad
        const meetingRoomsArray = Array.from(
          { length: totalMeetingRooms },
          (_, i) => i < data.MeetingRoom
        );

        const vrHeadsetsArray = Array.from(
          { length: totalVRHeadsets },
          (_, i) => i < data.VRHeadset
        );

        setStatus({
          desk: data.Desk ?? 0,
          aiServer: data.AIServer ?? 0,
          meetingRooms: meetingRoomsArray,
          vrHeadsets: vrHeadsetsArray,
        });
      })
      .catch(err => console.error("Error fetching resource data:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // Initial fetch
    fetchResourceData();

    // SignalR connection
    const connection: HubConnection = new HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        console.log("✅ Connected to SignalR hub");

        connection.on("RecieveBookingUpdate", () => {
          console.log("🔁 Booking update received via SignalR");
          fetchResourceData();
        });
      })
      .catch(err => console.error("❌ SignalR connection error:", err));

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
          {loading ? <LoadingSpinner /> : <span className="count">{status.desk}</span>}
        </div>

        <div className="overview-item">
          <h3>Lediga AI-servrar</h3>
          {loading ? <LoadingSpinner /> : <span className="count">{status.aiServer}</span>}
        </div>

        <div className="overview-item">
          <h3>Lediga mötesrum</h3>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="item-list">
              {MEETING_ROOM_NAMES.map((name, i) => (
                <div key={name} className="item-row">
                  <span>{name}</span>
                  <span className={`status ${status.meetingRooms[i] ? "available" : "booked"}`}></span>
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
              {VR_HEADSET_NAMES.map((name, i) => (
                <div key={name} className="item-row">
                  <span>{name}</span>
                  <span className={`status ${status.vrHeadsets[i] ? "available" : "booked"}`}></span>
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
