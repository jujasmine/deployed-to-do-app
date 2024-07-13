CREATE DATABASE todoapp;

CREATE TABLE todos(
    id VARCHAR(255) PRIMARY KEY,
    user_email VARCHAR (255),
    title VARCHAR (30),
    progress INT,
    date DATE
);

CREATE TABLE users(
    email VARCHAR(255) PRIMARY KEY,
    hashed_password VARCHAR(255)
);

INSERT INTO todos VALUES('0', 'jasmine.ju753@gmail.com', 'First todo', 10, '2024-07-04');