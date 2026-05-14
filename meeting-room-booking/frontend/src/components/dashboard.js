import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) navigate("/");
    axios.get("[127.0.0.1](http://127.0.0.1:5000/rooms)").then((res) => setRooms(res.data));
  }, [navigate]);

  return (
    <div className="dashboard">
      <h2>Available Meeting Rooms</h2>
      <div className="room-list">
        {rooms.map((room) => (
          <div className="room-card" key={room.id}>
            <h3>{room.name}</h3>
            <p>Capacity: {room.capacity}</p>
            <Link to={`/room/${room.id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
