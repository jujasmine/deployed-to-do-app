CREATE DATABASE todoapp;

CREATE TABLE todos(
    id VARCHAR(50) PRIMARY KEY,
    user_email VARCHAR (40),
    title VARCHAR (30),
    progress INT,
    entryDate DATE
);

CREATE TABLE users(
    email VARCHAR(40) PRIMARY KEY,
    hashed_password VARCHAR(30)
);

INSERT INTO todos VALUES('0', 'jasmine.ju753@gmail.com', 'First todo', 10, '2024-07-04');