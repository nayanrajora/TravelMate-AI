"""
Full API test suite for TravelMate AI backend.
Run: python tests/test_apis.py
"""
import sys
import requests

BASE = "http://127.0.0.1:8000"
PASS = 0
FAIL = 0

def ok(n, msg):
    global PASS
    print(f"[PASS] [{n:02d}] {msg}")
    PASS += 1

def fail(n, msg):
    global FAIL
    print(f"[FAIL] [{n:02d}] {msg}")
    FAIL += 1

def req(method, path, body=None, headers=None, expected=None):
    url = BASE + path
    r = requests.request(method, url, json=body, headers=headers)
    if expected and r.status_code not in expected:
        raise Exception(f"HTTP {r.status_code}: {r.text[:200]}")
    return r

# ── 1. Health ─────────────────────────────────────────────────────────────────
try:
    r = req("GET", "/health", expected=[200])
    assert r.json()["status"] == "healthy"
    ok(1, "Health check OK")
except Exception as e:
    fail(1, e); sys.exit(1)

# ── 2. Register ───────────────────────────────────────────────────────────────
try:
    r = req("POST", "/api/auth/register",
            body={"email": "tester@travelmate.com", "password": "Test1234!", "full_name": "Test User"},
            expected=[201, 400])
    if r.status_code == 201:
        ok(2, f"Register OK — id={r.json()['id']}")
    else:
        ok(2, "Register skipped (user already exists)")
except Exception as e:
    fail(2, e)

# ── 3. Login ──────────────────────────────────────────────────────────────────
try:
    r = req("POST", "/api/auth/login",
            body={"email": "tester@travelmate.com", "password": "Test1234!"},
            expected=[200])
    TOKEN = r.json()["access_token"]
    H = {"Authorization": f"Bearer {TOKEN}"}
    ok(3, "Login OK — token received")
except Exception as e:
    fail(3, e); sys.exit(1)

# ── 4. GET /me ────────────────────────────────────────────────────────────────
try:
    r = req("GET", "/api/auth/me", headers=H, expected=[200])
    ok(4, f"GET /me OK — id={r.json()['id']} email={r.json()['email']}")
except Exception as e:
    fail(4, e)

# ── 5. Generate Trip ──────────────────────────────────────────────────────────
try:
    r = req("POST", "/api/trips/generate", headers=H, expected=[201], body={
        "title": "Tokyo Adventure",
        "destination": "Tokyo, Japan",
        "start_date": "2026-09-01",
        "end_date": "2026-09-05",
        "budget_level": "Moderate",
        "traveler_type": "Solo",
        "interests": ["Food", "History"],
        "is_draft": False
    })
    TRIP_ID = r.json()["id"]
    ok(5, f"Generate Trip OK — id={TRIP_ID}")
except Exception as e:
    fail(5, e); sys.exit(1)

# ── 6. List Trips ─────────────────────────────────────────────────────────────
try:
    r = req("GET", "/api/trips/", headers=H, expected=[200])
    ok(6, f"List Trips OK — count={len(r.json())}")
except Exception as e:
    fail(6, e)

# ── 7. Get Single Trip ────────────────────────────────────────────────────────
try:
    r = req("GET", f"/api/trips/{TRIP_ID}", headers=H, expected=[200])
    ok(7, f"Get Trip OK — title={r.json()['title']}")
except Exception as e:
    fail(7, e)

# ── 8. List Expenses (auto-populated by AI) ───────────────────────────────────
try:
    r = req("GET", f"/api/trips/{TRIP_ID}/expenses", headers=H, expected=[200])
    expenses = r.json()
    ok(8, f"List Expenses OK — count={len(expenses)}")
except Exception as e:
    fail(8, e)

# ── 9. Add Expense ────────────────────────────────────────────────────────────
try:
    r = req("POST", f"/api/trips/{TRIP_ID}/expenses", headers=H, expected=[201], body={
        "category": "Transport", "amount": 45.50,
        "description": "Airport taxi", "date": "2026-09-01"
    })
    NEW_EXP_ID = r.json()["id"]
    ok(9, f"Add Expense OK — id={NEW_EXP_ID} amount={r.json()['amount']}")
except Exception as e:
    fail(9, e)

# ── 10. Get Single Expense ────────────────────────────────────────────────────
try:
    r = req("GET", f"/api/expenses/{NEW_EXP_ID}", headers=H, expected=[200])
    ok(10, f"Get Expense OK — category={r.json()['category']}")
except Exception as e:
    fail(10, e)

# ── 11. Update Expense ────────────────────────────────────────────────────────
try:
    r = req("PUT", f"/api/expenses/{NEW_EXP_ID}", headers=H, expected=[200], body={
        "amount": 55.00, "description": "Airport taxi updated"
    })
    ok(11, f"Update Expense OK — new amount={r.json()['amount']}")
except Exception as e:
    fail(11, e)

# ── 12. Expense Analytics ─────────────────────────────────────────────────────
try:
    r = req("GET", f"/api/trips/{TRIP_ID}/expenses/analytics", headers=H, expected=[200])
    d = r.json()
    ok(12, f"Expense Analytics OK — total_spent={d['total_spent']} categories={len(d['by_category'])}")
except Exception as e:
    fail(12, e)

# ── 13. Delete Expense ────────────────────────────────────────────────────────
try:
    r = req("DELETE", f"/api/expenses/{NEW_EXP_ID}", headers=H, expected=[204])
    ok(13, f"Delete Expense OK")
except Exception as e:
    fail(13, e)

# ── 14. List Packing Items (auto-populated) ───────────────────────────────────
try:
    r = req("GET", f"/api/trips/{TRIP_ID}/packing", headers=H, expected=[200])
    ok(14, f"List Packing Items OK — count={len(r.json())}")
except Exception as e:
    fail(14, e)

# ── 15. Add Packing Item ──────────────────────────────────────────────────────
try:
    r = req("POST", f"/api/trips/{TRIP_ID}/packing", headers=H, expected=[201], body={
        "item_name": "Rain Jacket", "category": "Clothing", "is_packed": False
    })
    NEW_PACK_ID = r.json()["id"]
    ok(15, f"Add Packing Item OK — id={NEW_PACK_ID}")
except Exception as e:
    fail(15, e)

# ── 16. Get Single Packing Item ───────────────────────────────────────────────
try:
    r = req("GET", f"/api/packing/{NEW_PACK_ID}", headers=H, expected=[200])
    ok(16, f"Get Packing Item OK — name={r.json()['item_name']}")
except Exception as e:
    fail(16, e)

# ── 17. Update Packing Item ───────────────────────────────────────────────────
try:
    r = req("PUT", f"/api/packing/{NEW_PACK_ID}", headers=H, expected=[200], body={
        "item_name": "Waterproof Rain Jacket", "category": "Clothing"
    })
    ok(17, f"Update Packing Item OK — name={r.json()['item_name']}")
except Exception as e:
    fail(17, e)

# ── 18. Toggle Packed ─────────────────────────────────────────────────────────
try:
    r = req("PATCH", f"/api/packing/{NEW_PACK_ID}/toggle", headers=H, expected=[200])
    ok(18, f"Toggle Packed OK — is_packed={r.json()['is_packed']}")
except Exception as e:
    fail(18, e)

# ── 19. Packing Progress ──────────────────────────────────────────────────────
try:
    r = req("GET", f"/api/trips/{TRIP_ID}/packing/progress", headers=H, expected=[200])
    d = r.json()
    ok(19, f"Packing Progress OK — {d['packed_items']}/{d['total_items']} packed ({d['progress_percentage']} pct)")
except Exception as e:
    fail(19, e)

# ── 20. Delete Packing Item ───────────────────────────────────────────────────
try:
    r = req("DELETE", f"/api/packing/{NEW_PACK_ID}", headers=H, expected=[204])
    ok(20, "Delete Packing Item OK")
except Exception as e:
    fail(20, e)

# ── 21. Chat: Send message ────────────────────────────────────────────────────
try:
    r = req("POST", f"/api/trips/{TRIP_ID}/chat", headers=H, expected=[200], body={
        "message": "What should I pack for Tokyo in September?"
    })
    d = r.json()
    reply = d["assistant_message"]["content"][:100]
    ok(21, f"Chat Send OK — user_id={d['user_message']['id']} assistant_id={d['assistant_message']['id']}")
    print(f"         AI: {reply}...")
except Exception as e:
    fail(21, e)

# ── 22. Chat: Follow-up ───────────────────────────────────────────────────────
try:
    r = req("POST", f"/api/trips/{TRIP_ID}/chat", headers=H, expected=[200], body={
        "message": "What is the best food to try?"
    })
    reply = r.json()["assistant_message"]["content"][:100]
    ok(22, "Chat Follow-up OK")
    print(f"         AI: {reply}...")
except Exception as e:
    fail(22, e)

# ── 23. Chat: Get history ─────────────────────────────────────────────────────
try:
    r = req("GET", f"/api/trips/{TRIP_ID}/chat/history", headers=H, expected=[200])
    d = r.json()
    ok(23, f"Chat History OK — {len(d['messages'])} messages")
except Exception as e:
    fail(23, e)

# ── 24. Chat: Clear history ───────────────────────────────────────────────────
try:
    r = req("DELETE", f"/api/trips/{TRIP_ID}/chat/history", headers=H, expected=[200])
    ok(24, f"Chat Clear OK — {r.json()['message']}")
except Exception as e:
    fail(24, e)

# ── 25. Auth guard: second user cannot access first user's trip ───────────────
try:
    req("POST", "/api/auth/register",
        body={"email": "hacker@evil.com", "password": "Hack1234!", "full_name": "Hacker"},
        expected=[201, 400])
    r2 = req("POST", "/api/auth/login",
             body={"email": "hacker@evil.com", "password": "Hack1234!"},
             expected=[200])
    H2 = {"Authorization": f"Bearer {r2.json()['access_token']}"}
    r3 = requests.get(f"{BASE}/api/trips/{TRIP_ID}", headers=H2)
    if r3.status_code == 403:
        ok(25, "Auth Guard OK — 403 for unauthorized trip access")
    else:
        fail(25, f"Expected 403 got {r3.status_code}")
except Exception as e:
    fail(25, e)

# ── 26. Update Trip ───────────────────────────────────────────────────────────
try:
    r = req("PUT", f"/api/trips/{TRIP_ID}", headers=H, expected=[200], body={
        "title": "Tokyo Adventure Final"
    })
    ok(26, f"Update Trip OK — title={r.json()['title']}")
except Exception as e:
    fail(26, e)

# ── 27. Delete Trip ───────────────────────────────────────────────────────────
try:
    r = req("DELETE", f"/api/trips/{TRIP_ID}", headers=H, expected=[204])
    ok(27, "Delete Trip OK (cascade)")
except Exception as e:
    fail(27, e)

# ── 28. Swagger UI ────────────────────────────────────────────────────────────
try:
    r = requests.get(f"{BASE}/docs")
    assert r.status_code == 200
    ok(28, "Swagger UI accessible at /docs")
except Exception as e:
    fail(28, e)

# ── Summary ───────────────────────────────────────────────────────────────────
print()
print("=" * 50)
print(f"  RESULTS: {PASS} passed  |  {FAIL} failed  |  {PASS+FAIL} total")
print("=" * 50)
sys.exit(0 if FAIL == 0 else 1)
