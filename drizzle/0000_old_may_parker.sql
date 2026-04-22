CREATE TYPE "public"."album_type" AS ENUM('shoot', 'collection');--> statement-breakpoint
CREATE TYPE "public"."album_visibility" AS ENUM('public', 'private');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" text DEFAULT 'user' NOT NULL,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp,
	"is_anonymous" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"expires_at" timestamp NOT NULL,
	"impersonated_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"id_token" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "guests_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"parent_id" uuid,
	"image" text,
	"ordering" integer DEFAULT 0 NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rating" integer NOT NULL,
	"image" text,
	"comment" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_name" text NOT NULL,
	"client_title" text,
	"client_image" text,
	"quote" text NOT NULL,
	"rating" integer DEFAULT 5 NOT NULL,
	"date_label" text,
	"is_published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"service" text,
	"budget" text,
	"location" text,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"album_id" uuid NOT NULL,
	"captured_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "leads_album_id_email_unique" UNIQUE("album_id","email")
);
--> statement-breakpoint
CREATE TABLE "albums" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"collection_owner_id" text,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"client_id" uuid,
	"cover_image_id" uuid,
	"type" "album_type" DEFAULT 'shoot' NOT NULL,
	"visibility" "album_visibility" DEFAULT 'private' NOT NULL,
	"access_code" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"shoot_date" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "albums_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uploaded_by_id" text NOT NULL,
	"ut_key" text NOT NULL,
	"ut_url" text NOT NULL,
	"filename" text NOT NULL,
	"mime_type" text,
	"thumbnail_url" text,
	"width" integer,
	"height" integer,
	"size_bytes" integer,
	"blur_data_url" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "images_ut_key_unique" UNIQUE("ut_key")
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"photographer_id" text NOT NULL,
	"linked_user_id" text,
	"email" text NOT NULL,
	"name" text,
	"phone" text,
	"notes" text,
	"access_code" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "clients_photographer_id_email_unique" UNIQUE("photographer_id","email")
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"album_access_id" uuid NOT NULL,
	"image_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "favorites_album_access_id_image_id_unique" UNIQUE("album_access_id","image_id")
);
--> statement-breakpoint
CREATE TABLE "album_accesses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"album_id" uuid NOT NULL,
	"visitor_email" text NOT NULL,
	"user_id" text,
	"first_accessed_at" timestamp DEFAULT now() NOT NULL,
	"last_accessed_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "album_accesses_album_id_visitor_email_unique" UNIQUE("album_id","visitor_email")
);
--> statement-breakpoint
CREATE TABLE "album_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"album_id" uuid NOT NULL,
	"image_id" uuid NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"caption" text,
	"is_cover" boolean DEFAULT false NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "album_images_album_id_image_id_unique" UNIQUE("album_id","image_id")
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "albums" ADD CONSTRAINT "albums_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "albums" ADD CONSTRAINT "albums_collection_owner_id_users_id_fk" FOREIGN KEY ("collection_owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "albums" ADD CONSTRAINT "albums_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_uploaded_by_id_users_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_photographer_id_users_id_fk" FOREIGN KEY ("photographer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_linked_user_id_users_id_fk" FOREIGN KEY ("linked_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_album_access_id_album_accesses_id_fk" FOREIGN KEY ("album_access_id") REFERENCES "public"."album_accesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "album_accesses" ADD CONSTRAINT "album_accesses_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "album_accesses" ADD CONSTRAINT "album_accesses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "album_images" ADD CONSTRAINT "album_images_album_id_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "album_images" ADD CONSTRAINT "album_images_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lc_album_idx" ON "leads" USING btree ("album_id");--> statement-breakpoint
CREATE INDEX "album_owner_idx" ON "albums" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "album_client_idx" ON "albums" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "album_collection_owner_idx" ON "albums" USING btree ("collection_owner_id");--> statement-breakpoint
CREATE INDEX "image_uploader_idx" ON "images" USING btree ("uploaded_by_id");--> statement-breakpoint
CREATE INDEX "cr_photographer_idx" ON "clients" USING btree ("photographer_id");--> statement-breakpoint
CREATE INDEX "fav_access_idx" ON "favorites" USING btree ("album_access_id");--> statement-breakpoint
CREATE INDEX "aa_album_idx" ON "album_accesses" USING btree ("album_id");--> statement-breakpoint
CREATE INDEX "aa_email_idx" ON "album_accesses" USING btree ("visitor_email");--> statement-breakpoint
CREATE INDEX "ai_album_idx" ON "album_images" USING btree ("album_id");--> statement-breakpoint
CREATE INDEX "ai_image_idx" ON "album_images" USING btree ("image_id");