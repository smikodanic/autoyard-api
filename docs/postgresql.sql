CREATE TABLE scraper_theparking_eu (
    car_id SERIAL PRIMARY KEY,          -- Unique identifier for each car
    searchpage_num INT,                 -- Number of the search page where the car was found at theparking.eu website
    searchpage_url TEXT,                -- url of the search page on theparking.eu website
    car_detail_url TEXT,                -- url of theparking.eu where are some of the car details
    redirect_url TEXT,                  -- url of theparking.eu which is redirected to external_url
    external_url TEXT,                  -- External URL to the ad
    make VARCHAR(100),                  -- Car make (e.g., Toyota, Ford)
    model VARCHAR(100),                 -- Car model (e.g., Corolla, Mustang)
    version VARCHAR(100),               -- Version or trim of the car
    price NUMERIC(10, 2),               -- Price of the car
    price_unit VARCHAR(10),             -- Unit of the price (e.g., USD, EUR)
    image_url TEXT,                     -- URL of the car's image
    date_published DATE,                -- Date the ad was published
    location VARCHAR(255),              -- Location of the car
    fuel VARCHAR(50),                   -- Fuel type (e.g., Petrol, Diesel)
    mileage_km INT,                     -- Mileage in kilometers
    year SMALLINT,                      -- Year of manufacture
    transmission VARCHAR(50),           -- Transmission type (e.g., Automatic, Manual)
    color VARCHAR(50),                  -- Car color
    doors SMALLINT,                     -- Number of doors
    category VARCHAR(100),              -- Category (e.g., SUV, Sedan)
    ad_title TEXT,                      -- Title of the advertisement
    crawled_at TIMESTAMP DEFAULT NOW(), -- Timestamp when the data was crawled
);

CREATE TABLE cars (
    car_id SERIAL PRIMARY KEY,              -- Unique identifier for each car
    ad_url TEXT,                            -- car_detail_url orredirect_url
    make VARCHAR(100),                      -- Car make (e.g., Toyota, Ford)
    model VARCHAR(100),                     -- Car model (e.g., Corolla, Mustang)
    version VARCHAR(100),                   -- Version or trim of the car
    price NUMERIC(10, 2),                   -- Price of the car
    price_unit VARCHAR(10) DEFAULT "EUR",   -- Unit of the price (e.g., USD, EUR)
    image_url TEXT,                         -- URL of the car's image
    date_published DATE,                    -- Date the ad was published
    country VARCHAR(255),                   -- Location of the car
    fuel VARCHAR(50),                       -- Fuel type (e.g., Petrol, Diesel)
    mileage_km INT,                         -- Mileage in kilometers
    year SMALLINT,                          -- Year of manufacture
    transmission VARCHAR(50),               -- Transmission type (e.g., Automatic, Manual)
    color VARCHAR(50),                      -- Car color
    doors SMALLINT,                         -- Number of doors
    ad_title TEXT,                      -- Title of the advertisement
    ad_text TEXT,                      -- Title of the advertisement
    crawled_at TIMESTAMP DEFAULT NOW(), -- Timestamp when the data was crawled
    external_url TEXT                   -- External URL to the ad
);


------ GENERAL SQL COMMANDS
CREATE TABLE scraper_theparking_eu AS SELECT * FROM cars;   -- copy table

-- copy table with its constraints
CREATE TABLE scraper_theparking_eu (LIKE cars INCLUDING ALL);
INSERT INTO scraper_theparking_eu SELECT * FROM cars;

DROP TABLE cars_copy;                           -- drop table
SELECT COUNT(id) FROM cars_copy;                -- count table
