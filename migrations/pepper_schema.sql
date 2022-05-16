--
-- PostgreSQL database dump
--

-- Dumped from database version 11.9
-- Dumped by pg_dump version 14.2


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', 'public', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


grant usage on schema public to public;
grant create on schema public to public;


--
-- Name: enum_Organizers_status; Type: TYPE; Schema: public; Owner: pepper
--

CREATE TYPE public."enum_Organizers_status" AS ENUM (
    'accepted',
    'rejected',
    'pending'
);


ALTER TYPE public."enum_Organizers_status" OWNER TO pepper;

--
-- Name: enum_UserMatches_gender; Type: TYPE; Schema: public; Owner: pepper
--

CREATE TYPE public."enum_UserMatches_gender" AS ENUM (
    'accepted',
    'unavailable',
    'unchecked',
    'waiting'
);


ALTER TYPE public."enum_UserMatches_gender" OWNER TO pepper;

--
-- Name: enum_UserMatches_status; Type: TYPE; Schema: public; Owner: pepper
--

CREATE TYPE public."enum_UserMatches_status" AS ENUM (
    'accepted',
    'waiting'
);


ALTER TYPE public."enum_UserMatches_status" OWNER TO pepper;

--
-- Name: enum_UserParties_status; Type: TYPE; Schema: public; Owner: pepper
--

CREATE TYPE public."enum_UserParties_status" AS ENUM (
    'waiting',
    'accepted',
    'attended',
    'rejected',
    'absent'
);


ALTER TYPE public."enum_UserParties_status" OWNER TO pepper;

--
-- Name: enum_Users_Gender; Type: TYPE; Schema: public; Owner: pepper
--

CREATE TYPE public."enum_Users_Gender" AS ENUM (
    'man',
    'woman'
);


ALTER TYPE public."enum_Users_Gender" OWNER TO pepper;

--
-- Name: enum_Users_gender; Type: TYPE; Schema: public; Owner: pepper
--

CREATE TYPE public."enum_Users_gender" AS ENUM (
    'man',
    'woman'
);


ALTER TYPE public."enum_Users_gender" OWNER TO pepper;

SET default_tablespace = '';

--
-- Name: Organizers; Type: TABLE; Schema: public; Owner: pepper
--

CREATE TABLE public."Organizers" (
    id integer NOT NULL,
    "phoneNumber" character varying(255) NOT NULL,
    "userName" character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    location character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    imgs json NOT NULL,
    foods json NOT NULL,
    drinks json NOT NULL,
    status public."enum_Organizers_status" DEFAULT 'pending'::public."enum_Organizers_status" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."Organizers" OWNER TO pepper;

--
-- Name: Organizers_id_seq; Type: SEQUENCE; Schema: public; Owner: pepper
--

CREATE SEQUENCE public."Organizers_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Organizers_id_seq" OWNER TO pepper;

--
-- Name: Organizers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pepper
--

ALTER SEQUENCE public."Organizers_id_seq" OWNED BY public."Organizers".id;


--
-- Name: Parties; Type: TABLE; Schema: public; Owner: pepper
--

CREATE TABLE public."Parties" (
    id integer NOT NULL,
    theme character varying(255) NOT NULL,
    date timestamp with time zone NOT NULL,
    price double precision NOT NULL,
    people integer,
    "minAge" integer NOT NULL,
    "maxAge" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone,
    "OrganizerId" integer
);


ALTER TABLE public."Parties" OWNER TO pepper;

--
-- Name: Parties_id_seq; Type: SEQUENCE; Schema: public; Owner: pepper
--

CREATE SEQUENCE public."Parties_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Parties_id_seq" OWNER TO pepper;

--
-- Name: Parties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pepper
--

ALTER SEQUENCE public."Parties_id_seq" OWNED BY public."Parties".id;


--
-- Name: UserMatches; Type: TABLE; Schema: public; Owner: pepper
--

CREATE TABLE public."UserMatches" (
    status public."enum_UserMatches_status" DEFAULT 'waiting'::public."enum_UserMatches_status" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "UserId" integer NOT NULL,
    "MatchId" integer NOT NULL
);


ALTER TABLE public."UserMatches" OWNER TO pepper;

--
-- Name: UserParties; Type: TABLE; Schema: public; Owner: pepper
--

CREATE TABLE public."UserParties" (
    status public."enum_UserParties_status" DEFAULT 'waiting'::public."enum_UserParties_status" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "PartyId" integer NOT NULL,
    "UserId" integer NOT NULL
);


ALTER TABLE public."UserParties" OWNER TO pepper;

--
-- Name: Users; Type: TABLE; Schema: public; Owner: pepper
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    gender public."enum_Users_gender" NOT NULL,
    "phoneNumber" character varying(255) NOT NULL,
    address text NOT NULL,
    description text,
    job character varying(255) NOT NULL,
    imgs json NOT NULL,
    interests json NOT NULL,
    facebook text,
    instagram text,
    snapchat text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);


ALTER TABLE public."Users" OWNER TO pepper;

--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: pepper
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Users_id_seq" OWNER TO pepper;

--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pepper
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: Organizers id; Type: DEFAULT; Schema: public; Owner: pepper
--

ALTER TABLE ONLY public."Organizers" ALTER COLUMN id SET DEFAULT nextval('public."Organizers_id_seq"'::regclass);


--
-- Name: Parties id; Type: DEFAULT; Schema: public; Owner: pepper
--

ALTER TABLE ONLY public."Parties" ALTER COLUMN id SET DEFAULT nextval('public."Parties_id_seq"'::regclass);


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: pepper
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Name: Organizers Organizers_phoneNumber_key; Type: CONSTRAINT; Schema: public; Owner: pepper
--

ALTER TABLE ONLY public."Organizers"
    ADD CONSTRAINT "Organizers_phoneNumber_key" UNIQUE ("phoneNumber");


--
-- Name: Organizers Organizers_pkey; Type: CONSTRAINT; Schema: public; Owner: pepper
--

ALTER TABLE ONLY public."Organizers"
    ADD CONSTRAINT "Organizers_pkey" PRIMARY KEY (id);


--
-- Name: Organizers Organizers_userName_key; Type: CONSTRAINT; Schema: public; Owner: pepper
--

ALTER TABLE ONLY public."Organizers"
    ADD CONSTRAINT "Organizers_userName_key" UNIQUE ("userName");


--
-- Name: Parties Parties_pkey; Type: CONSTRAINT; Schema: public; Owner: pepper
--

ALTER TABLE ONLY public."Parties"
    ADD CONSTRAINT "Parties_pkey" PRIMARY KEY (id);


--
-- Name: UserMatches UserMatches_pkey; Type: CONSTRAINT; Schema: public; Owner: pepper
--

ALTER TABLE ONLY public."UserMatches"
    ADD CONSTRAINT "UserMatches_pkey" PRIMARY KEY ("UserId", "MatchId");


--
-- Name: UserParties UserParties_pkey; Type: CONSTRAINT; Schema: public; Owner: pepper
--

ALTER TABLE ONLY public."UserParties"
    ADD CONSTRAINT "UserParties_pkey" PRIMARY KEY ("PartyId", "UserId");


--
-- Name: Users Users_phoneNumber_key; Type: CONSTRAINT; Schema: public; Owner: pepper
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_phoneNumber_key" UNIQUE ("phoneNumber");


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: pepper
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: Parties Parties_OrganizerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pepper
--

ALTER TABLE ONLY public."Parties"
    ADD CONSTRAINT "Parties_OrganizerId_fkey" FOREIGN KEY ("OrganizerId") REFERENCES public."Organizers"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: UserMatches UserMatches_MatchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pepper
--

ALTER TABLE ONLY public."UserMatches"
    ADD CONSTRAINT "UserMatches_MatchId_fkey" FOREIGN KEY ("MatchId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserMatches UserMatches_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pepper
--

ALTER TABLE ONLY public."UserMatches"
    ADD CONSTRAINT "UserMatches_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserParties UserParties_PartyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pepper
--

ALTER TABLE ONLY public."UserParties"
    ADD CONSTRAINT "UserParties_PartyId_fkey" FOREIGN KEY ("PartyId") REFERENCES public."Parties"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserParties UserParties_UserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pepper
--

ALTER TABLE ONLY public."UserParties"
    ADD CONSTRAINT "UserParties_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

