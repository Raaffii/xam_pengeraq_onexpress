-- Remove soft-deleted (active = 0) rows from examresults.
-- The app hard-deletes marks and every read filters active = 1, so these rows
-- are invisible leftovers from the older delete method.
-- Run against primeapp_xampgq. Review step 1 before running step 3.

-- 1. Preview what will be deleted (expected: 5 rows as of 2026-10-29).
SELECT examresultsid, examseriesid, examsubjid, studentid, marks,
       active + 0 AS active, editeddate
FROM examresults
WHERE active = 0
ORDER BY examresultsid;

-- 2. Back up those rows so the delete can be undone.
CREATE TABLE IF NOT EXISTS examresults_inactive_backup LIKE examresults;
INSERT INTO examresults_inactive_backup
SELECT * FROM examresults WHERE active = 0;

-- 3. Delete them.
START TRANSACTION;

DELETE FROM examresults WHERE active = 0;

-- Should return 0 before you COMMIT.
SELECT COUNT(*) AS remaining_inactive FROM examresults WHERE active = 0;

COMMIT;  -- or ROLLBACK; if the numbers look wrong

-- 4. Optional restore, if ever needed:
-- INSERT INTO examresults SELECT * FROM examresults_inactive_backup;
-- 5. Once you are sure, drop the backup:
-- DROP TABLE examresults_inactive_backup;
