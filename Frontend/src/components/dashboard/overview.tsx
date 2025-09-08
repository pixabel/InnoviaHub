import { useState } from "react";
import "./overviewcard.css";

const OverviewCard = () => {

    // Statisk tillgänglighet 
    // Implementer SignalR för realtidsuppdatering?

    const [desksAvailable] = useState(12);
    const [aiServerAvailable] = useState(1);

    const renderStatus = (available: boolean) => (
        <span className={`status ${available ? "available" : "booked"}`} />
    );

    const [vrSets] = useState(
        Array.from({ length: 4 }, (_, i) => ({ id: i + 1, available: true }))
    );
    const [meetingRooms] = useState(
        Array.from({ length: 4 }, (_, i) => ({ id: i + 1, available: true }))
    );

    return (
        <div className="overviewCard">
            <h2>Snabb översikt</h2>
            <p>Här får du en snabb översikt över alla lediga skrivbord, mötesrum, VR-headset och AI-servrar.</p>

            <div className="overview-grid">
            {/* Skrivbord */}
            <div className="overview-item">
                <h3>Lediga skrivbord</h3>
                <span className="count">{desksAvailable}</span>
            </div>

            {/* AI server */}
            <div className="overview-item">
                <h3>Lediga AI-servrar</h3>
                <span className="count">{aiServerAvailable}</span>
            </div>

            {/* Mötes rum */}
            <div className="overview-item">
                <h3>Lediga mötesrum</h3>
                <div className="item-list">
                {meetingRooms.map((room) => (
                    <div key={room.id} className="item-row">
                    <span>Mötesrum {room.id}</span>
                    {renderStatus(room.available)}
                    </div>
                ))}
                </div>
            </div>

            {/* VR sets */}
            <div className="overview-item">
                <h3>Lediga VR-headset</h3>
                <div className="item-list">
                {vrSets.map((vr) => (
                    <div key={vr.id} className="item-row">
                    <span>VR-set {vr.id}</span>
                    {renderStatus(vr.available)}
                    </div>
                ))}
                </div>
            </div>
        </div>
        </div>
    )
};

export default OverviewCard;