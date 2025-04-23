--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.4 (Debian 17.4-1.pgdg120+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: announcements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.announcements (
    id character varying(36) NOT NULL,
    "userId" character varying(36) NOT NULL,
    title character varying(256) NOT NULL,
    content character varying(256) NOT NULL,
    category character varying(256) NOT NULL,
    type character varying(256) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.announcements OWNER TO postgres;

--
-- Name: kysely_migration; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kysely_migration (
    name character varying(255) NOT NULL,
    "timestamp" character varying(255) NOT NULL
);


ALTER TABLE public.kysely_migration OWNER TO postgres;

--
-- Name: kysely_migration_lock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kysely_migration_lock (
    id character varying(255) NOT NULL,
    is_locked integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.kysely_migration_lock OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id character varying(36) NOT NULL,
    email character varying(256) NOT NULL,
    password character varying(60) NOT NULL,
    role character varying(5) NOT NULL,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['user'::character varying, 'admin'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: announcements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.announcements (id, "userId", title, content, category, type, "createdAt") FROM stdin;
c89db424-b1c0-4664-b951-3b4a17a8aa86	76b391cd-bbfb-4d8e-aaab-7b9a0e443fb6	cieple	dranie	none	none	2025-04-23 10:26:50.422+00
\.


--
-- Data for Name: kysely_migration; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kysely_migration (name, "timestamp") FROM stdin;
initial	2025-04-23T10:24:53.544Z
\.


--
-- Data for Name: kysely_migration_lock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kysely_migration_lock (id, is_locked) FROM stdin;
migration_lock	0
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password, role) FROM stdin;
76b391cd-bbfb-4d8e-aaab-7b9a0e443fb6	yakui@gmail.com	$2b$10$M540CnBjDPyB2EH984hmruJMgji3Adc6H8PZKaVylJlw6SudVfXaS	admin
\.


--
-- Name: announcements announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);


--
-- Name: kysely_migration_lock kysely_migration_lock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kysely_migration_lock
    ADD CONSTRAINT kysely_migration_lock_pkey PRIMARY KEY (id);


--
-- Name: kysely_migration kysely_migration_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kysely_migration
    ADD CONSTRAINT kysely_migration_pkey PRIMARY KEY (name);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: announcements announcements_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT "announcements_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

