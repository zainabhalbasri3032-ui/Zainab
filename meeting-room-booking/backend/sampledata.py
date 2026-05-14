from app import app, db
from models import User, Room

# Populate database with sample data
with app.app_context():
    db.create_all()

    if not User.query.first():
        users = [
            User(username="admin", password="admin"),
            User(username="john", password="1234"),
        ]
        rooms = [
            Room(name="Conference Room A", capacity=10),
            Room(name="Board Room B", capacity=20),
            Room(name="Small Meeting Room C", capacity=6),
        ]
        db.session.add_all(users + rooms)
        db.session.commit()
        print("Sample users and rooms added!")
    else:
        print("Database already contains data.")
