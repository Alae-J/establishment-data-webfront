from flask import (
    Flask, request, jsonify,
    send_from_directory, session
)
from flask_cors import CORS
import os, sqlite3, hashlib
from functools import wraps

# --- config & helpers -------------------------------------------------------

app = Flask(__name__)
CORS(app,
     supports_credentials=True,
     origins=["http://localhost:5173"])
app.secret_key = "robotmza"
CORS(app, supports_credentials=True)

DATABASE = "datab.db"
ETABS = [f"etab_{i}" for i in range(1, 27)]
ROWS = ["AE", "CE", "IGF", "CC"]
COLS = ["IC", "OB", "REC", "CA", "DD", "DA"]
SEP = "|"

def hash_password(pw: str) -> str:
    # placeholder: in prod use real hashing!
    return pw

def is_admin(user_name: str) -> bool:
    return user_name not in ETABS

def login_required(fn):
    @wraps(fn)
    def wrapper(*a, **kw):
        if not session.get("logged"):
            return jsonify(success=False, error="Not authenticated"), 401
        return fn(*a, **kw)
    return wrapper

def query_db(query, args=(), one=False):
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    cur.execute(query, args)
    rv = cur.fetchall()
    con.close()
    if one:
        return rv[0] if rv else None
    return rv

def load_row(folder, row):
    path = os.path.join(folder, f"{row}.txt")
    if os.path.exists(path):
        with open(path) as f:
            return f.read().strip().split(SEP)
    return [""] * len(COLS)

def save_row(folder, row, data):
    path = os.path.join(folder, f"{row}.txt")
    with open(path, "w") as f:
        f.write(SEP.join(data))

# --- auth -------------------------------------------------------------------

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or request.form
    email = data.get("email", "")
    pw    = hash_password(data.get("password", ""))
    user = query_db("SELECT fname, name, password FROM users WHERE email=?", (email,), one=True)

    if user and user[2] == pw:
        session["logged"] = True
        session["user"] = {
            "fname": user[0],  # hajar
            "name": user[1]    # admin
        }
        return jsonify(success=True, name=user[0], isAdmin=is_admin(user[1]))

    return jsonify(success=False, error="Invalid email or password"), 401

@app.route("/logout", methods=["POST"])
@login_required
def logout():
    session.clear()
    return jsonify(success=True)

@app.route("/api/check-auth", methods=["GET"])
def check_auth():
    if session.get("logged"):
        user = session.get("user", {})
        return jsonify({
            "name": user.get("fname", "Unknown"),
            "isAdmin": is_admin(user.get("name", ""))
        })
    return jsonify(success=False, error="Not authenticated"), 401

# --- établissements listing & files -----------------------------------------

@app.route("/etablissements", methods=["GET"])
@login_required
def list_etabs():
    return jsonify(etablissements=ETABS)

@app.route(
    "/etablissement/insert/<int:id>/<int:year>/<report>/<version>",
    methods=["GET"]
)
@login_required
def list_reports(id, year, report, version):
    base = f"etablissements/etab_{id}/{year}/{report}/{version}"
    os.makedirs(base, exist_ok=True)
    files = []
    for root, _, fs in os.walk(base):
        for fn in fs:
            files.append(os.path.relpath(os.path.join(root, fn), "etablissements"))
    return jsonify(
        id=id, year=year,
        report=report, version=version,
        files=files,
        isAdmin=is_admin(session["user"])
    )

@app.route(
    "/uploads/<int:id>/<int:year>/<report>/<version>/<filename>",
    methods=["GET"]
)
@login_required
def serve_pdf(id, year, report, version, filename):
    folder = f"etablissements/etab_{id}/{year}/{report}/{version}"
    return send_from_directory(folder, filename, as_attachment=False)

# --- matrix endpoints -------------------------------------------------------

@app.route("/etablissement/<int:id>/<int:year>/matrix", methods=["GET", "POST"])
@login_required
def matrix(id, year):
    folder = f"etablissements/etab_{id}/{year}/matrix"
    os.makedirs(folder, exist_ok=True)

    if request.method == "POST":
        payload = request.get_json()
        for row in ROWS:
            data = payload.get(row, [])
            save_row(folder, row, data)
        return jsonify(success=True)

    # GET
    mat = { row: load_row(folder, row) for row in ROWS }
    return jsonify(id=id, year=year, matrix=mat, columns=COLS, rows=ROWS)

# --- reports/details --------------------------------------------------------

@app.route("/reports", methods=["GET"])
@login_required
def reports():
    user = session["user"]
    if user not in ETABS:
        return jsonify(success=False, error="No report for admin"), 403

    etab_id = int(user.split("_",1)[1])
    path = f"etablissements/etab_{etab_id}/details_{etab_id}.txt"
    if not os.path.exists(path):
        return jsonify(success=False, error="Details file not found"), 404

    lines = open(path).read().splitlines()
    # chunk every 6 for table
    table = [
        dict(
            constat=lines[i],
            recommendation=lines[i+1],
            plan=lines[i+2],
            intervenant=lines[i+3],
            delai=lines[i+4],
            etat=lines[i+5],
        )
        for i in range(0, len(lines), 6)
    ]
    return jsonify(id=etab_id, table=table)

# --- fallback / healthcheck ------------------------------------------------

@app.route("/health", methods=["GET"])
def health():
    return jsonify(status="ok")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)