-- Table: public.user
-- Generated: 2026-03-01T08:23:28.697Z

CREATE TABLE "public"."user" (
  "user_id" integer NOT NULL DEFAULT nextval('user_user_id_seq'::regclass),
  "username" character varying NOT NULL,
  "email" character varying NOT NULL,
  "password_hash" character varying NOT NULL,
  "role" character varying NOT NULL DEFAULT 'Consumer'::character varying,
  "profile_pic_url" text,
  "phone_number" character varying,
  "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "user_pkey" PRIMARY KEY ("user_id"),
  CONSTRAINT "user_email_key" UNIQUE ("email"),
  CONSTRAINT "user_username_key" UNIQUE ("username"),
  CONSTRAINT "user_email_not_null" NOT NULL email,
  CONSTRAINT "user_password_hash_not_null" NOT NULL password_hash,
  CONSTRAINT "user_role_not_null" NOT NULL role,
  CONSTRAINT "user_user_id_not_null" NOT NULL user_id,
  CONSTRAINT "user_username_not_null" NOT NULL username
);

-- Indexes
CREATE INDEX idx_user_email ON public."user" USING btree (email);
CREATE UNIQUE INDEX user_email_key ON public."user" USING btree (email);
CREATE UNIQUE INDEX user_username_key ON public."user" USING btree (username);
