from dotenv import load_dotenv
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from database import db
from models import User, Room, Booking

load_dotenv()

app = Flask(__name__)

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "fallback-secret-key")

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
    "DATABASE_URL",
    "sqlite:///instance/bookings.db"
)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

CORS(app)

db.init_app(app)

# HEALTH CHECK / HOME ROUTE
@app.route("/")
def home():
    return "Smart Meeting Backend Running"


# ---------- ROUTES ----------

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "Missing credentials"}), 400

    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username, password=password).first()

    if user:
        return jsonify({"success": True, "message": "Login successful"})

    return jsonify({"success": False, "message": "Invalid username or password"})


@app.route("/rooms", methods=["GET"])
def get_rooms():
    rooms = Room.query.all()
    data = [{"id": r.id, "name": r.name, "capacity": r.capacity} for r in rooms]
    return jsonify(data)


@app.route("/rooms/<int:room_id>", methods=["GET"])
def get_room(room_id):
    room = Room.query.get(room_id)

    if not room:
        return jsonify({"error": "Room not found"}), 404

    return jsonify({
        "id": room.id,
        "name": room.name,
        "capacity": room.capacity
    })


@app.route("/rooms/<int:room_id>/bookings", methods=["GET"])
def get_room_bookings(room_id):
    bookings = Booking.query.filter_by(room_id=room_id).all()

    data = [
        {
            "id": b.id,
            "date": b.date,
            "start_time": b.start_time,
            "end_time": b.end_time,
            "username": b.username,
        }
        for b in bookings
    ]

    return jsonify(data)


@app.route("/book", methods=["POST"])
def book_room():
    data = request.get_json()

    try:
        username = data["username"]
        room_id = int(data["room_id"])
        date = data["date"]
        start_time = data["start_time"]
        end_time = data["end_time"]

    except (KeyError, TypeError, ValueError):
        return jsonify({
            "success": False,
            "message": "Invalid data"
        }), 400

    conflict = Booking.query.filter(
        Booking.room_id == room_id,
        Booking.date == date,
        Booking.start_time < end_time,
        Booking.end_time > start_time
    ).first()

    if conflict:
        return jsonify({
            "success": False,
            "message": "This time slot is already booked."
        })

    booking = Booking(
        username=username,
        room_id=room_id,
        date=date,
        start_time=start_time,
        end_time=end_time,
    )

    db.session.add(booking)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Booking confirmed!"
    })


@app.route("/admin/bookings", methods=["GET"])
def admin_all_bookings():
    bookings = Booking.query.all()

    data = [
        {
            "id": b.id,
            "username": b.username,
            "room_id": b.room_id,
            "date": b.date,
            "start_time": b.start_time,
            "end_time": b.end_time,
        }
        for b in bookings
    ]

    return jsonify(data)


if __name__ == "__main__":
    if not os.path.exists("instance"):
        os.makedirs("instance")

    with app.app_context():
        db.create_all()

    app.run(debug=True)