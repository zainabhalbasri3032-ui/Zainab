import React, { useState } from "react";
import axios from "axios";

function BookingForm({ roomId }) {
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const handleBooking = async (e) => {
    e.preventDefault();
    const username = localStorage.getItem("user");
    try {
      const res = await axios.post("[127.0.0.1](http://127.0.0.1:5000/book)", {
        username,
        room_id: roomId,
        date,
        start_time: start,
        end_time: end,
      });
      alert(res.data.message);
    } catch {
      alert("Error making booking.");
    }
  };

  return (
    <form onSubmit={handleBooking} className="booking-form">
      <h3>Book This Room</h3>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="time"
        value={start}
        onChange={(e) => setStart(e.target.value)}
        required
      />
      <input
        type="time"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
        required
      />
      <button type="submit">Book</button>
    </form>
  );
}

export default BookingForm;
