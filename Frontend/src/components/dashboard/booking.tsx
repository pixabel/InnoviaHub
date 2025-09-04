import "./bookingcard.css";

const BookingCard = () => {
  const bookings = [
    {
      name: "Mötesrum 1",
      date: "Tisdag 25/8",
      time: "12:00–14:00"
    },
    {
      name: "AI-Server",
      date: "Tisdag 27/8",
      time: "11:00–16:00"
    },
    {
      name: "VR-Headset",
      date: "Tisdag 29/8",
      time: "12:00–13:00"
    }
  ];

  return (
    <div className="bookingCard">
      <h2>Mina bokningar</h2>
      <p>Här hittar du dina bokningar.</p>
      <div className="booking-list">
        {bookings.map((b, index) => (
          <div key={index} className="booking-item">
            <div>
              <h3>{b.name}</h3>
              <p>{b.date}</p>
              <p>Kl: {b.time}</p>
            </div>
            <button className="cancel-button">Avboka</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingCard;
