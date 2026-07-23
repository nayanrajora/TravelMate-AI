import sqlite3
import datetime

conn = sqlite3.connect('Backend/travelmate.db')
c = conn.cursor()

# Insert user if not exists
c.execute("SELECT COUNT(*) FROM users WHERE id=1")
if c.fetchone()[0] == 0:
    c.execute("INSERT INTO users (id, email, hashed_password, full_name, is_active) VALUES (1, 'mock@example.com', 'mock', 'Mock User', 1)")

# Insert trip if not exists
c.execute("SELECT COUNT(*) FROM trips WHERE id=1")
if c.fetchone()[0] == 0:
    c.execute("INSERT INTO trips (id, user_id, title, destination, start_date, end_date, budget_level, traveler_type, is_draft) VALUES (1, 1, 'Mock Trip', 'Tokyo, Japan', '2026-09-01', '2026-09-10', 'Moderate', 'Solo', 0)")

conn.commit()
conn.close()
