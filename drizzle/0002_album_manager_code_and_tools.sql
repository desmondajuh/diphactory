ALTER TABLE "albums"
ADD COLUMN IF NOT EXISTS "access_code_plain" text;
