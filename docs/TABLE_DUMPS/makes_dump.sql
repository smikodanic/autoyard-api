--
-- PostgreSQL database dump
--

-- Dumped from database version 12.20 (Ubuntu 12.20-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.20 (Ubuntu 12.20-0ubuntu0.20.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: makes; Type: TABLE; Schema: public; Owner: carfinder
--

CREATE TABLE public.makes (
    make_id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.makes OWNER TO carfinder;

--
-- Name: makes_make_id_seq; Type: SEQUENCE; Schema: public; Owner: carfinder
--

CREATE SEQUENCE public.makes_make_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.makes_make_id_seq OWNER TO carfinder;

--
-- Name: makes_make_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: carfinder
--

ALTER SEQUENCE public.makes_make_id_seq OWNED BY public.makes.make_id;


--
-- Name: makes make_id; Type: DEFAULT; Schema: public; Owner: carfinder
--

ALTER TABLE ONLY public.makes ALTER COLUMN make_id SET DEFAULT nextval('public.makes_make_id_seq'::regclass);


--
-- Data for Name: makes; Type: TABLE DATA; Schema: public; Owner: carfinder
--

COPY public.makes (make_id, name) FROM stdin;
1	Abarth
2	AC
3	Acura
4	Aiways
5	Aixam
6	Alfa Romeo
7	ALPINA
8	Alpine
10	Ariel
11	Artega
12	Asia Motors
13	Aston Martin
14	Audi
15	Austin
16	Austin Healey
17	BAIC
18	Barkas
19	Bentley
20	BMW
21	Borgward
22	Brilliance
23	Bugatti
24	Buick
25	BYD
26	Cadillac
27	Casalini
28	Caterham
29	Cenntro
30	Chatenet
31	Chevrolet
32	Chrysler
34	Cobra
35	Corvette
36	Cupra
37	Dacia
38	Daewoo
39	Daihatsu
40	DeTomaso
41	DFSK
42	Dodge
43	Donkervoort
44	DS Automobiles
45	e.GO
46	Elaris
47	Estrima
48	Ferrari
49	Fiat
50	Fisker
51	Ford
52	GAC Gonow
53	Gemballa
54	Genesis
55	GMC
56	Grecav
57	GWM
58	Hamann
59	Holden
60	Honda
61	Hongqi
62	Hummer
63	Hyundai
64	INEOS
65	Infiniti
66	Isuzu
67	Iveco
68	JAC
69	Jaguar
70	Jeep
71	Jiayuan
72	Kia
73	Koenigsegg
74	KTM
75	Lada
76	Lamborghini
77	Lancia
78	Land Rover
79	Landwind
80	Leapmotor
81	LEVC
82	Lexus
83	Ligier
84	Lincoln
85	Lotus
86	Lucid
87	Lynk&Co
88	Mahindra
89	MAN
90	Maserati
91	Maxus
92	Maybach
93	Mazda
94	McLaren
95	Mercedes-Benz
96	MG
97	Microcar
98	Microlino
99	MINI
100	Mitsubishi
101	Morgan
102	NIO
103	Nissan
104	NSU
105	Oldsmobile
106	Opel
107	ORA
108	Pagani
109	Peugeot
110	Piaggio
111	Plymouth
112	Polestar
113	Pontiac
114	Porsche
115	Proton
116	Renault
117	Rolls-Royce
118	Rover
119	Ruf
120	Saab
121	Santana
122	Seat
123	Seres
124	Skoda
125	Smart
126	speedART
127	Spyker
128	Ssangyong
129	Subaru
130	Suzuki
131	SWM
132	Talbot
133	Tata
134	TECHART
135	Tesla
136	Toyota
137	Trabant
138	Triumph
139	TVR
140	VinFast
141	Volkswagen
142	Volvo
143	Wartburg
144	Westfield
145	WEY
146	Wiesmann
147	XEV
148	XPENG
149	Zhidou
33	Citroen
151	Other
\.


--
-- Name: makes_make_id_seq; Type: SEQUENCE SET; Schema: public; Owner: carfinder
--

SELECT pg_catalog.setval('public.makes_make_id_seq', 151, true);


--
-- Name: makes makes_name_key; Type: CONSTRAINT; Schema: public; Owner: carfinder
--

ALTER TABLE ONLY public.makes
    ADD CONSTRAINT makes_name_key UNIQUE (name);


--
-- Name: makes makes_pkey; Type: CONSTRAINT; Schema: public; Owner: carfinder
--

ALTER TABLE ONLY public.makes
    ADD CONSTRAINT makes_pkey PRIMARY KEY (make_id);


--
-- PostgreSQL database dump complete
--

