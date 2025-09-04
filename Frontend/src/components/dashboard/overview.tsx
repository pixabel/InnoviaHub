import "./overviewcard.css";

const OverviewCard = () => {

    return (
        <div className="overviewCard">
            <h2>Snabb översikt</h2>
            <p>Här får du en snabb översikt över alla lediga skrivbord, mötesrum, VR-headset och AI-servrar.</p>
            <div className="overview-grid">
                <div className="overview-item">
                    <h3>Lediga skrivbord</h3>
                    <span className="count">12</span>
                </div>
                <div className="overview-item">
                    <h3>Lediga VR-headset</h3>
                    <span className="count">4</span>
                </div>
                {/* Lägg till ytterligare info */}
            </div>
        </div>
    )
};

export default OverviewCard;