CREATE TABLE upcoming (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  time DATE,
  date_added DATE DEFAULT CURRENT_TIMESTAMP,
  description TEXT,
  host INTEGER REFERENCES users(id),
  going INTEGER[],
  maybe INTEGER[]
)

CREATE TABLE previous (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  time DATE,
  description TEXT
)

CREATE TABLE nsfw (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  time DATE,
  date_added DATE DEFAULT CURRENT_TIMESTAMP,
  description TEXT,
  host INTEGER REFERENCES users(id),
  going INTEGER[],
  maybe INTEGER[]
)