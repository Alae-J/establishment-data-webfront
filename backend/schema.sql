-- Table users
CREATE TABLE users (
    user_id         INTEGER PRIMARY KEY AUTOINCREMENT,
    email           TEXT    UNIQUE NOT NULL,
    password_hash   TEXT    NOT NULL,
    name            TEXT,
    role            TEXT    NOT NULL CHECK(role IN ('admin', 'establishment')),
    establishment_id INTEGER REFERENCES establishments(establishment_id),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table establishments
CREATE TABLE establishments (
    establishment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT    UNIQUE NOT NULL,
    code            TEXT    UNIQUE NOT NULL,
    description     TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table matrix_data
CREATE TABLE matrix_data (
    matrix_id        INTEGER PRIMARY KEY AUTOINCREMENT,
    establishment_id INTEGER NOT NULL REFERENCES establishments(establishment_id),
    year             INTEGER NOT NULL,
    AE_IC TEXT, AE_OB TEXT, AE_REC TEXT, AE_CA TEXT, AE_DD TEXT, AE_DA TEXT,
    CE_IC TEXT, CE_OB TEXT, CE_REC TEXT, CE_CA TEXT, CE_DD TEXT, CE_DA TEXT,
    IGF_IC TEXT,IGF_OB TEXT,IGF_REC TEXT,IGF_CA TEXT,IGF_DD TEXT,IGF_DA TEXT,
    CC_IC TEXT, CC_OB TEXT, CC_REC TEXT, CC_CA TEXT, CC_DD TEXT, CC_DA TEXT,
    last_updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated_by  INTEGER REFERENCES users(user_id),
    UNIQUE(establishment_id,year)
);

-- Table report_types
CREATE TABLE report_types (
    report_type_id INTEGER PRIMARY KEY AUTOINCREMENT,
    type_code      TEXT    UNIQUE NOT NULL,
    description    TEXT
);

-- Table reports
CREATE TABLE reports (
    report_id        INTEGER PRIMARY KEY AUTOINCREMENT,
    establishment_id INTEGER NOT NULL REFERENCES establishments(establishment_id),
    year             INTEGER NOT NULL,
    report_type_id   INTEGER NOT NULL REFERENCES report_types(report_type_id),
    version          TEXT    NOT NULL,
    original_filename TEXT   NOT NULL,
    stored_filepath   TEXT   UNIQUE NOT NULL,
    upload_timestamp  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by       INTEGER REFERENCES users(user_id),
    UNIQUE(establishment_id,year,report_type_id,version)
);

-- Indexes
CREATE INDEX idx_users_email                ON users(email);
CREATE INDEX idx_establishments_code        ON establishments(code);
CREATE INDEX idx_matrix_data_establishment_year ON matrix_data(establishment_id,year);
CREATE INDEX idx_reports_establishment_year_type ON reports(establishment_id,year,report_type_id);
