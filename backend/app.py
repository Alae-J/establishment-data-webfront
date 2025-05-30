from flask import (
    Flask, request, jsonify,
    send_from_directory, session
)
from flask_cors import CORS
import os, sqlite3
from functools import wraps
import werkzeug
# --- config & helpers -------------------------------------------------------

app = Flask(__name__)
CORS(app,
     supports_credentials=True,
     origins=["http://localhost:5173", "http://localhost:8080"])
app.secret_key = "robotmza"

DATABASE = "datab.db"
ROWS = ["AE", "CE", "IGF", "CC"]
COLS = ["IC", "OB", "REC", "CA", "DD", "DA"]
SEP = "|"

def hash_password(pw: str) -> str:
    # placeholder: in prod use real hashing!
    return pw

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

def get_db():
    con = sqlite3.connect(DATABASE)
    con.row_factory = sqlite3.Row
    return con

# def load_row(folder, row):
#     path = os.path.join(folder, f"{row}.txt")
#     if os.path.exists(path):
#         with open(path) as f:
#             return f.read().strip().split(SEP)
#     return [""] * len(COLS)

# def save_row(folder, row, data):
#     path = os.path.join(folder, f"{row}.txt")
#     with open(path, "w") as f:
#         f.write(SEP.join(data))

# --- auth -------------------------------------------------------------------

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or request.form
    email = data.get("email", "")
    pw    = hash_password(data.get("password", ""))

    # fetch name, pw_hash, role, establishment_id
    user = query_db(
        "SELECT name, password_hash, role, establishment_id FROM users WHERE email = ?",
        (email,),
        one=True
    )

    if user and user[1] == pw:
        session["logged"] = True
        session["user"] = {
            "name":            user[0],
            "role":            user[2],
            "establishmentId": user[3]
        }
        return jsonify(
            success=True,
            name=user[0],
            isAdmin=(user[2] == "admin"),
            role=user[2],
            establishmentId=user[3]
        )

    return jsonify(success=False, error="Email ou mot de passe invalide"), 401

@app.route("/logout", methods=["POST"])
@login_required
def logout():
    session.clear()
    return jsonify(success=True)

@app.route("/api/check-auth", methods=["GET"])
def check_auth():
    if not session.get("logged"):
        return jsonify(success=False, error="Non authentifié"), 401

    usr = session["user"]
    return jsonify({
        "name":            usr["name"],
        "isAdmin":         (usr["role"] == "admin"),
        "role":            usr["role"],
        "establishmentId": usr.get("establishmentId")
    })

# --- établissements listing & files -----------------------------------------

@app.route("/etablissements", methods=["GET"])
@login_required
def list_etabs():
    # or replace with a real DB query if you like
    codes = [f"etab_{i}" for i in range(1, 27)]
    return jsonify(etablissements=codes)

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
    usr = session["user"]
    return jsonify(
        id=id, year=year,
        report=report, version=version,
        paths=files,
        isAdmin=(usr["role"] == "admin")
    )

@app.route("/saveFile/<int:id>/<int:year>/<report>/<version>", methods=["POST"])
@login_required
def save_file(id, year, report, version):
    # this should match your list_reports base
    base = f"etablissements/etab_{id}/{year}/{report}/{version}"
    os.makedirs(base, exist_ok=True)

    if 'file' not in request.files:
        return jsonify(success=False, error="No file part"), 400

    file: werkzeug.datastructures.FileStorage = request.files['file']
    if file.filename == '':
        return jsonify(success=False, error="No selected file"), 400

    # Optionally validate .pdf extension
    if not file.filename.lower().endswith('.pdf'):
        return jsonify(success=False, error="Only PDFs allowed"), 400

    # Prevent directory traversal
    filename = os.path.basename(file.filename)
    filepath = os.path.join(base, filename)
    file.save(filepath)

    return jsonify(success=True, filename=filename)

# Accept a string code instead of an int id:
@app.route(
    "/etablissement/insert/<code>/<int:year>/<report>/<version>",
    methods=["GET"]
)
@login_required
def list_reports_by_code(code, year, report, version):
    # look up the numeric id
    row = query_db(
      "SELECT establishment_id FROM establishments WHERE code = ?",
      (code,),
      one=True
    )
    if not row:
        return jsonify(error="Etablissement introuvable"), 404
    return list_reports(row[0], year, report, version)


@app.route(
    "/saveFile/<code>/<int:year>/<report>/<version>",
    methods=["POST"]
)
@login_required
def save_file_by_code(code, year, report, version):
    row = query_db(
      "SELECT establishment_id FROM establishments WHERE code = ?",
      (code,),
      one=True
    )
    if not row:
        return jsonify(error="Etablissement introuvable"), 404
    return save_file(row[0], year, report, version)


@app.route(
    "/uploads/<code>/<int:year>/<report>/<version>/<filename>",
    methods=["GET"]
)
@login_required
def serve_pdf_by_code(code, year, report, version, filename):
    row = query_db(
      "SELECT establishment_id FROM establishments WHERE code = ?",
      (code,),
      one=True
    )
    if not row:
        return jsonify(error="Etablissement introuvable"), 404
    return send_from_directory(
      f"etablissements/etab_{row[0]}/{year}/{report}/{version}",
      filename,
      as_attachment=False
    )

@app.route("/api/establishments", methods=["GET"])
@login_required
def api_establishments():
    rows = query_db("SELECT code, name FROM establishments ORDER BY name")
    data = [{"key": code, "label": name} for code, name in rows]
    return jsonify(establishments=data)

# --- FIXED: Route now accepts string code instead of integer ID ---
@app.route("/api/etablissement/<code>", methods=["GET"])
@login_required
def etablissement_info(code):
    row = query_db(
        "SELECT establishment_id, name, code FROM establishments WHERE code = ?", # Query by code, fetch ID
        (code,), one=True
    )
    if not row:
        return jsonify(success=False, error="Établissement introuvable"), 404
    # Return ID, label (name), key (code)
    return jsonify(success=True, etablissement={"id": row[0], "label": row[1], "key": row[2]})

@app.route("/api/etablissement/<int:id>", methods=["GET"])
@login_required
def etablissement_info_by_id(id):
    row = query_db(
        "SELECT establishment_id, name, code FROM establishments WHERE establishment_id = ?",
        (id,), one=True
    )
    if not row:
        return jsonify(success=False, error="Établissement introuvable"), 404
    return jsonify(
      success=True,
      etablissement={"id": row[0], "label": row[1], "key": row[2]}
    )

@app.route("/api/years", methods=["GET"])
@login_required
def api_years():
    return jsonify(years=list(range(2020, 2026)))

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
    # --- Permission Check --- 
    # Allow admin access to any matrix
    # Allow establishment user access only to their own matrix
    usr = session["user"]
    if usr["role"] == "establishment" and usr["establishmentId"] != id:
        return jsonify(success=False, error="Access denied to this establishment's matrix"), 403
    # --- End Permission Check ---

    con = get_db()
    cur = con.cursor()

    if request.method == "POST":
        payload = request.get_json() or {}
        # On fait un upsert pour chaque ligne (AE, CE, IGF, CC)
        for row in ROWS:
            vals = payload.get(row, [])  # liste de 6 valeurs
            # Remplacez placeholders et colonnes dynamiquement
            cols_sql       = ", ".join(f"{row}_{c}" for c in COLS)
            placeholders   = ", ".join("?" for _ in COLS)
            updates_sql    = ", ".join(f"{row}_{c}=excluded.{row}_{c}" for c in COLS)

            cur.execute(f"""
                INSERT INTO matrix_data (
                    establishment_id, year, {cols_sql}
                ) VALUES (
                    ?, ?, {placeholders}
                )
                ON CONFLICT(establishment_id, year)
                DO UPDATE SET
                    {updates_sql}
            """, [id, year, *vals])

        con.commit()
        return jsonify(success=True)

    # --- GET: on lit la ligne existante ---
    cur.execute(
        "SELECT * FROM matrix_data WHERE establishment_id=? AND year=?",
        (id, year)
    )
    row = cur.fetchone()

    if not row:
        # pas d’enregistrement : on renvoie 4 tableaux vides
        matrix = {r: [""]*len(COLS) for r in ROWS}
    else:
        matrix = {
            r: [ row[f"{r}_{c}"] or "" for c in COLS ]
            for r in ROWS
        }

    return jsonify(id=id, year=year, matrix=matrix, columns=COLS, rows=ROWS)

# Alias matrix endpoint so you can pass code instead of numeric id:
@app.route("/etablissement/<code>/<int:year>/matrix", methods=["GET", "POST"])
@login_required
def matrix_by_code(code, year):
    # look up numeric ID from the code
    row = query_db(
        "SELECT establishment_id FROM establishments WHERE code = ?",
        (code,),
        one=True
    )
    if not row:
        return jsonify(success=False, error="Établissement introuvable"), 404

    # delegate back to your id‐based matrix handler
    return matrix(row[0], year)

# --- reports/details --------------------------------------------------------

@app.route("/reports", methods=["GET"])
@login_required
def reports():
    usr = session["user"]
    if usr["role"] != "establishment":
        return jsonify(success=False, error="No report for admin"), 403

    etab_id = usr["establishmentId"]
    path = f"etablissements/etab_{etab_id}/details_{etab_id}.txt"
    if not os.path.exists(path):
        return jsonify(success=False, error="Details file not found"), 404

    lines = open(path).read().splitlines()
    table = [
        {"constat": lines[i],
         "recommendation": lines[i+1],
         "plan": lines[i+2],
         "intervenant": lines[i+3],
         "delai": lines[i+4],
         "etat": lines[i+5]}
        for i in range(0, len(lines), 6)
    ]
    return jsonify(id=etab_id, table=table)

@app.route("/api/report-metadata/<int:id>/<int:year>", methods=["GET"])
@login_required
def api_report_metadata(id, year):
    # --- Permission Check --- 
    # Allow admin access to any metadata
    # Allow establishment user access only to their own metadata
    usr = session["user"]
    if usr["role"] == "establishment" and usr["establishmentId"] != id:
        return jsonify(success=False, error="Access denied to this establishment's reports"), 403
    # --- End Permission Check ---

    # Fetch all report types that have at least one report for this establishment & year
    rows = query_db("""
        SELECT rt.type_code, rt.description, r.version
        FROM reports r
        JOIN report_types rt ON r.report_type_id = rt.report_type_id
        WHERE r.establishment_id = ? AND r.year = ?
        ORDER BY rt.type_code, r.version
    """, (id, year))

    # Group versions by type_code
    metadata: dict[str, dict[str, list[str]]] = {}
    for type_code, description, version in rows:
        if type_code not in metadata:
            metadata[type_code] = {
                "description": description,
                "versions": []
            }
        if version not in metadata[type_code]["versions"]:
            metadata[type_code]["versions"].append(version)

    # Build the final list
    result = [
        {
            "key": type_code,
            "name": type_code,
            "description": md["description"],
            "versions": md["versions"]
        }
        for type_code, md in metadata.items()
    ]

    return jsonify(reports=result)

# New code‐based version
@app.route("/api/report-metadata/<code>/<int:year>", methods=["GET"])
@login_required
def api_report_metadata_by_code(code, year):
    # look up numeric ID from code
    row = query_db(
        "SELECT establishment_id FROM establishments WHERE code = ?",
        (code,),
        one=True
    )
    if not row:
        return jsonify(success=False, error="Établissement introuvable"), 404

    # delegate to the existing function
    # (Flask will treat the returned Response normally)
    return api_report_metadata(row[0], year)


# --- fallback / healthcheck ------------------------------------------------

@app.route("/health", methods=["GET"])
def health():
    return jsonify(status="ok")

if __name__ == "__main__":
    # Ensure the backend directory exists relative to the script
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    DATABASE = os.path.join(backend_dir, "datab.db")
    # Make sure the database file path is correct
    print(f"Using database at: {DATABASE}")
    if not os.path.exists(DATABASE):
        print("Warning: Database file not found!")

    app.run(host="0.0.0.0", port=5000, debug=True)

