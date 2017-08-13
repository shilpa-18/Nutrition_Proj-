DROP DATABASE IF EXISTS recipe_app;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS recipes;
CREATE DATABASE recipe_app;

\c recipe_app;

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  password_digest VARCHAR NOT NULL,
  token VARCHAR NOT NULL
);


CREATE TABLE recipes(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    recipe_id INT REFERENCES users(id),
    name TEXT NOT NULL,
    unit TEXT NOT NULL,
    protein TEXT NOT NULL,
    sugar TEXT NOT NULL,
    calories INT NOT NULL
);