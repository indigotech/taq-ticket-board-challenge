CREATE TABLE "quest" (
	"external_id" text NOT NULL CONSTRAINT "quest_external_id_unique" UNIQUE,
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "quest_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar NOT NULL,
	"description" varchar NOT NULL,
	"status" varchar DEFAULT 'open' NOT NULL,
	"difficulty" varchar DEFAULT 'normal' NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp(6) with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp(6) with time zone
);
