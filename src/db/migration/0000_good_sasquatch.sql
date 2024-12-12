CREATE TABLE IF NOT EXISTS "directories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(20) NOT NULL,
	"user_id" integer NOT NULL,
	CONSTRAINT "unique_user_directory" UNIQUE("user_id","name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(25) NOT NULL,
	"description" varchar(80) DEFAULT '',
	"deadline" timestamp NOT NULL,
	"is_important" boolean DEFAULT false,
	"is_completed" boolean DEFAULT false,
	"directory_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(100) NOT NULL,
	"password" text NOT NULL,
	"email" varchar(254) NOT NULL,
	"is_verified" boolean DEFAULT false,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verify_token" (
	"user_id" integer NOT NULL,
	"token" text NOT NULL,
	"exp_date" timestamp DEFAULT NOW() + INTERVAL '10 minutes' NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "directories" ADD CONSTRAINT "fk_user_directories" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_directory_id_directories_id_fk" FOREIGN KEY ("directory_id") REFERENCES "public"."directories"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "verify_token" ADD CONSTRAINT "verify_token_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
