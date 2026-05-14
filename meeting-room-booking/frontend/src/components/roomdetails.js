import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import BookingForm from "./BookingForm";

function RoomDetails() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) navigate("/");
    axios.get(`[127.0.0.1](http://127.0.0.1:5000/rooms/${id})`).then((res) => setRoom(res.data));
    axios.get(`[127.0.0.1](http://127.0.0.1:5000/rooms/${id}/bookings)`).then((res) => setBookings(res.data));
  }, [id, navigate]);

  if (!room) return <p>Loading...</p>;

  return (
    <div className="room-details">
      <h2>{room.name}</h2>
      <p>Capacity: {room.capacity}</p>
      <h3>Current Bookings</h3>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <ul>
          {bookings.map((b) => (
            <li key={b.id}>
              {b.date} — {b.start_time} to {b.end_time} ({b.username})
            </li>
          ))}
        </ul>
      )}
      <BookingForm roomId={id} />
    </div>
  );
}

export default RoomDetails;
