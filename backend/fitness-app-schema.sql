CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  username    TEXT NOT NULL,
  password    TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE CHECK (POSITION('@' IN email) > 1),
  first_name  TEXT NOT NULL,
  last_name  TEXT NOT NULL,
  is_admin    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE exercise (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  category    TEXT,
  duration    INTEGER,
  intensity   INTEGER,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE nutrition (
  id          SERIAL PRIMARY KEY,
  name        TEXT,
  category    TEXT DEFAULT 'misc',
  calories    INTEGER,
  quantity    INTEGER DEFAULT 1, 
  image_url   TEXT,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE sleep (
  id          SERIAL PRIMARY KEY,
  start_time  TIMESTAMP NOT NULL,
  end_time    TIMESTAMP NOT NULL,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,  
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

