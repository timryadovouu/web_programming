CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL
);

CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    owner_id INTEGER,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

INSERT INTO users (email, hashed_password) VALUES
('user@mail.com', '$2b$12$qN/VRH3VssHYcYWZ/VNIgeI3ny3UZzieUj3uMtVLgLQVMhj1aL.a6'),  -- 1111
('newbie@mail.com', '$2b$12$v6rRiWOFt2gefnVNxMHTUurQ5KB44EtPkJpdJHGwQJcFUJ6/pejI2');  -- 1122

INSERT INTO rooms (name, owner_id) VALUES
('Room 1', 1),  
('Room 2', 1),
('Room 3', 2); 
