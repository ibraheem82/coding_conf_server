CREATE TABLE "tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"github_username" varchar(255) NOT NULL,
	"avatar_url" text NOT NULL,
	"ticket_number" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tickets_email_unique" UNIQUE("email"),
	CONSTRAINT "tickets_ticket_number_unique" UNIQUE("ticket_number")
);
