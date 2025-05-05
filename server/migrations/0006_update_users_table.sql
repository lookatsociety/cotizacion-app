-- Actualizar la tabla de usuarios para Firebase
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS firebase_uid TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS display_name TEXT,
  ALTER COLUMN password DROP NOT NULL,
  ALTER COLUMN username DROP NOT NULL; 