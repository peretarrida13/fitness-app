-- Add sleep tracking columns to daily_activity
ALTER TABLE daily_activity
  ADD COLUMN IF NOT EXISTS sleep_hours NUMERIC,
  ADD COLUMN IF NOT EXISTS sleep_score INT,
  ADD COLUMN IF NOT EXISTS sleep_deep_minutes INT,
  ADD COLUMN IF NOT EXISTS sleep_light_minutes INT,
  ADD COLUMN IF NOT EXISTS sleep_rem_minutes INT,
  ADD COLUMN IF NOT EXISTS sleep_awake_minutes INT;

-- Allow manual activity entries (garmin_activity_id no longer required)
ALTER TABLE activities ALTER COLUMN garmin_activity_id DROP NOT NULL;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS is_manual BOOLEAN DEFAULT FALSE;
