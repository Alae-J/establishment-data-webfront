-- 1) Add three more establishment‐role users (you already have user_id=1 admin, 2 & 3 below);
--    these will become user_id = 4,5,6 respectively.
INSERT INTO users (email, password_hash, name, role, establishment_id) VALUES
  ('office@offices.ma','officepass','Said','establishment',3),
  ('training@formation.ma','trainpass','Hassan','establishment',4),
  ('stateco@state.ma','statepass','Leila','establishment',5);

-- 2) Bulk-insert one “v1” report for every establishment × year × report_type
WITH years(year) AS (
  VALUES (2020),(2021),(2022),(2023),(2024),(2025)
)
INSERT INTO reports (
  establishment_id,
  year,
  report_type_id,
  version,
  original_filename,
  stored_filepath,
  upload_timestamp,
  uploaded_by
)
SELECT
  e.establishment_id,
  y.year,
  rt.report_type_id,
  'v1',
  lower(rt.type_code) 
    || '_' || y.year 
    || '_v1.pdf'                            AS original_filename,
  'reports/'
    || e.establishment_id
    || '/' || y.year
    || '/' || rt.type_code
    || '/v1/'
    || lower(rt.type_code)
    || '_' || y.year
    || '_v1.pdf'                            AS stored_filepath,
  CURRENT_TIMESTAMP                           AS upload_timestamp,
  u.user_id                                   AS uploaded_by
FROM establishments e
CROSS JOIN years y
CROSS JOIN report_types rt
JOIN users u
  ON u.establishment_id = e.establishment_id
  AND u.role = 'establishment';

-- 3) (Optional) Insert a “v2” for just 2022 & 2023, so you have multiple versions to test.
WITH years2(year) AS (
  VALUES (2022),(2023)
)
INSERT INTO reports (
  establishment_id,
  year,
  report_type_id,
  version,
  original_filename,
  stored_filepath,
  upload_timestamp,
  uploaded_by
)
SELECT
  e.establishment_id,
  y.year,
  rt.report_type_id,
  'v2',
  lower(rt.type_code) 
    || '_' || y.year 
    || '_v2.pdf'                            AS original_filename,
  'reports/'
    || e.establishment_id
    || '/' || y.year
    || '/' || rt.type_code
    || '/v2/'
    || lower(rt.type_code)
    || '_' || y.year
    || '_v2.pdf'                            AS stored_filepath,
  CURRENT_TIMESTAMP                           AS upload_timestamp,
  u.user_id                                   AS uploaded_by
FROM establishments e
CROSS JOIN years2 y
CROSS JOIN report_types rt
JOIN users u
  ON u.establishment_id = e.establishment_id
  AND u.role = 'establishment';
