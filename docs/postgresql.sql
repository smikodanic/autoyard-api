CREATE TABLE public.makes (
	make_id serial4 NOT NULL,
	"name" varchar(100) NOT NULL,
	CONSTRAINT makes_name_key UNIQUE (name),
	CONSTRAINT makes_pkey PRIMARY KEY (make_id)
);

CREATE TABLE public.models (
	model_id serial4 NOT NULL,
	make_id int4 NOT NULL,
	"name" varchar(100) NOT NULL,
	CONSTRAINT models_pkey PRIMARY KEY (model_id),
	CONSTRAINT fk_make FOREIGN KEY (make_id) REFERENCES public.makes(make_id) ON DELETE CASCADE
);


CREATE TABLE cars (
    id SERIAL PRIMARY KEY,                  -- Unique identifier for each car
    ad_url TEXT NOT NULL UNIQUE,            -- car_detail_url or redirect_url
    ad_title TEXT NOT NULL,                 -- Title of the advertisement
    ad_text TEXT,                           -- Content of the advertisement
    ad_date DATE,                           -- Date the ad was published
    make_id INT NOT NULL,                   -- Car make ID (e.g., Toyota, Ford)
    model_id INT NOT NULL,                  -- Car model ID (e.g., Corolla, Mustang)
    version VARCHAR(100),                   -- Version or trim of the car
    fuel VARCHAR(50),                       -- Fuel type (e.g., Petrol, Diesel)
    mileage_km INT,                         -- Mileage in kilometers
    power_kw INT,                           -- Motor power in kW
    engine_cc INT,                          -- Engine size in cubic centimeters
    year SMALLINT,                          -- Year of manufacture
    transmission VARCHAR(50),               -- Transmission type (e.g., Automatic, Manual)
    color VARCHAR(50),                      -- Car color
    doors SMALLINT,                         -- Number of doors
    country VARCHAR(255),                   -- Location of the car
    price_EUR NUMERIC(10, 2),               -- Price of the car in €
    image_url TEXT,                         -- URL of the car's image
    created_at TIMESTAMP DEFAULT NOW(),     -- Timestamp when the table row was created
    scraper_table_row VARCHAR(50),          -- The table and id from scraper_... table and related row ID, for example: "scraper_theparking_eu-12"
    CONSTRAINT fk_make FOREIGN KEY (make_id) REFERENCES makes(make_id),  -- Foreign key to makes table
    CONSTRAINT fk_model FOREIGN KEY (model_id) REFERENCES models(model_id)  -- Foreign key to models table
);


CREATE TABLE public.scraper_theparking_eu (
	car_id int4 NOT NULL DEFAULT nextval('cars_car_id_seq'::regclass),
	searchpage_num int4 NULL,
	searchpage_url varchar(400) NOT NULL,
	car_detail_url varchar(400) NOT NULL,
	redirect_url varchar(400) NULL,
	make varchar(255) NOT NULL,
	model varchar(255) NOT NULL,
	"version" varchar(255) NULL,
	price int4 NULL,
	price_unit varchar(5) NULL DEFAULT '€'::character varying,
	image_url varchar(400) NULL,
	date_published timestamptz NULL,
	"location" varchar(255) NULL,
	fuel varchar(255) NULL,
	mileage_km int4 NULL,
	"year" int4 NULL,
	transmission varchar(255) NULL,
	color varchar(255) NULL,
	doors varchar(255) NULL,
	category varchar(255) NULL,
	ad_title varchar(400) NULL,
	crawled_at timestamptz NOT NULL,
	external_url varchar(400) NULL,
	CONSTRAINT scraper_theparking_eu_car_detail_url_key UNIQUE (car_detail_url),
	CONSTRAINT scraper_theparking_eu_pkey PRIMARY KEY (car_id, crawled_at)
);






------ GENERAL SQL COMMANDS -------------
-----------------------------------------
CREATE TABLE scraper_theparking_eu AS SELECT * FROM cars;   -- copy table

-- copy table with its constraints
CREATE TABLE scraper_theparking_eu (LIKE cars INCLUDING ALL);
INSERT INTO scraper_theparking_eu SELECT * FROM cars;

-- see ownership of the sequence
SELECT
    seq.relname AS sequence_name,
    tbl.relname AS table_name,
    col.attname AS column_name
FROM
    pg_class seq
LEFT JOIN
    pg_depend dep ON seq.oid = dep.objid
LEFT JOIN
    pg_class tbl ON dep.refobjid = tbl.oid
LEFT JOIN
    pg_attribute col ON dep.refobjid = col.attrelid AND dep.refobjsubid = col.attnum
WHERE
    seq.relkind = 'S'  -- 'S' stands for sequence
    AND seq.relname = 'cars_car_id_seq'; -- Replace with your sequence name

-- reassign sequence before deleteing the table
ALTER SEQUENCE cars_car_id_seq OWNED BY scraper_theparking_eu.car_id;


DROP TABLE cars;                           -- drop table
SELECT COUNT(id) FROM cars;                -- count table
SELECT DISTINCT make FROM scraper_theparking_eu; -- distinct select
