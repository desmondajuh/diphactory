DO $$
BEGIN
  CREATE TYPE "public"."user_role" AS ENUM('photographer', 'client', 'admin', 'super_admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint

ALTER TABLE "users"
ALTER COLUMN "role" DROP DEFAULT;
--> statement-breakpoint
UPDATE "users"
SET "role" = CASE
  WHEN "role" IN ('photographer', 'client', 'admin', 'super_admin') THEN "role"
  ELSE 'client'
END;
--> statement-breakpoint
ALTER TABLE "users"
ALTER COLUMN "role" TYPE "public"."user_role"
USING "role"::"public"."user_role";
--> statement-breakpoint
ALTER TABLE "users"
ALTER COLUMN "role" SET DEFAULT 'client';
--> statement-breakpoint

ALTER TABLE "albums" DROP CONSTRAINT IF EXISTS "albums_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "albums" DROP CONSTRAINT IF EXISTS "albums_collection_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "images" DROP CONSTRAINT IF EXISTS "images_uploaded_by_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "clients" DROP CONSTRAINT IF EXISTS "clients_photographer_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "clients" DROP CONSTRAINT IF EXISTS "clients_linked_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "album_accesses" DROP CONSTRAINT IF EXISTS "album_accesses_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "leads" DROP CONSTRAINT IF EXISTS "leads_album_id_albums_id_fk";
--> statement-breakpoint

ALTER TABLE "albums"
ALTER COLUMN "owner_id" TYPE uuid USING "owner_id"::uuid,
ALTER COLUMN "collection_owner_id" TYPE uuid USING nullif("collection_owner_id", '')::uuid;
--> statement-breakpoint
ALTER TABLE "images"
ALTER COLUMN "uploaded_by_id" TYPE uuid USING "uploaded_by_id"::uuid;
--> statement-breakpoint
ALTER TABLE "clients"
ALTER COLUMN "photographer_id" TYPE uuid USING "photographer_id"::uuid,
ALTER COLUMN "linked_user_id" TYPE uuid USING nullif("linked_user_id", '')::uuid;
--> statement-breakpoint
ALTER TABLE "album_accesses"
ALTER COLUMN "user_id" TYPE uuid USING nullif("user_id", '')::uuid;
--> statement-breakpoint

ALTER TABLE "clients"
ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now() NOT NULL;
--> statement-breakpoint
UPDATE "clients" SET "updated_at" = COALESCE("updated_at", "created_at", now());
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "client_albums" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "title" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE IF EXISTS "client_albums"
ALTER COLUMN "user_id" TYPE uuid USING "user_id"::uuid;
--> statement-breakpoint
ALTER TABLE IF EXISTS "client_albums"
ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now() NOT NULL;
--> statement-breakpoint
UPDATE "client_albums" SET "updated_at" = COALESCE("updated_at", "created_at", now());
--> statement-breakpoint

ALTER TABLE "images"
ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "created_at" SET NOT NULL;
--> statement-breakpoint
UPDATE "images" SET "created_at" = COALESCE("created_at", now());
--> statement-breakpoint

ALTER TABLE "favorites"
ALTER COLUMN "created_at" SET DEFAULT now(),
ALTER COLUMN "created_at" SET NOT NULL;
--> statement-breakpoint
UPDATE "favorites" SET "created_at" = COALESCE("created_at", now());
--> statement-breakpoint

ALTER TABLE "albums"
ALTER COLUMN "client_id" DROP NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT now();
--> statement-breakpoint
UPDATE "albums" SET "updated_at" = COALESCE("updated_at", "created_at", now());
--> statement-breakpoint

ALTER TABLE "albums" ADD CONSTRAINT "albums_owner_id_users_id_fk"
FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "albums" ADD CONSTRAINT "albums_collection_owner_id_users_id_fk"
FOREIGN KEY ("collection_owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_uploaded_by_id_users_id_fk"
FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_photographer_id_users_id_fk"
FOREIGN KEY ("photographer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_linked_user_id_users_id_fk"
FOREIGN KEY ("linked_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "album_accesses" ADD CONSTRAINT "album_accesses_user_id_users_id_fk"
FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_album_id_albums_id_fk"
FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
DO $$
BEGIN
  ALTER TABLE "client_albums" ADD CONSTRAINT "client_albums_user_id_users_id_fk"
  FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
