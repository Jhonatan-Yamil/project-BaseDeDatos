CREATE TABLE country (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    code CHAR(2) NOT NULL UNIQUE
);

CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    code CHAR(2) NOT NULL UNIQUE
);

CREATE TABLE rol (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE
);

create table rank_levels (
    id serial primary key,
    rank_name varchar(20) not null unique,
    rank_order int not null unique
);
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    rank_id int references rank_levels(id),
    level INT,
    country INT NOT NULL REFERENCES country(id),
    regions INT NOT NULL REFERENCES regions(id),
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS info_players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    player_id INT NOT NULL UNIQUE REFERENCES players(id),
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    player_1 INT NOT NULL REFERENCES players(id),
    player_2 INT NOT NULL REFERENCES players(id),
    player_3 INT NOT NULL REFERENCES players(id),
    player_4 INT NOT NULL REFERENCES players(id),
    player_5 INT NOT NULL REFERENCES players(id)
);

CREATE TABLE maps (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE agents (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    role INT NOT NULL REFERENCES rol(id)
);

CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    map_id INT NOT NULL,
    match_date DATE NOT NULL,
    duration_minutes INT DEFAULT -1
) PARTITION BY RANGE (match_date);

CREATE TABLE matches_result (
    match_id INT PRIMARY KEY REFERENCES matches(id),
    winning_team_id INT NOT NULL REFERENCES teams(id),
    losing_team_id INT NOT NULL REFERENCES teams(id)
);

CREATE TABLE player_stats (
    id SERIAL PRIMARY KEY,
    player_id INT NOT NULL REFERENCES players(id),
    match_id INT NOT NULL REFERENCES matches(id),
    agent_id INT NOT NULL REFERENCES agents(id),
    team_id INT NOT NULL REFERENCES teams(id),
    kills INT,
    deaths INT,
    assists INT
);

CREATE TABLE player_player_stats (
    id SERIAL PRIMARY KEY,
    player_id INT NOT NULL REFERENCES players(id),
    opponent_id INT NOT NULL REFERENCES players(id),
    match_id INT NOT NULL REFERENCES matches(id),
    kills INT,
    deaths INT,
    assists INT
);

CREATE TABLE matches_act1 PARTITION OF matches
FOR VALUES FROM ('2025-01-01') TO ('2025-05-01');

CREATE TABLE matches_act2 PARTITION OF matches
FOR VALUES FROM ('2025-05-01') TO ('2025-09-01');

CREATE TABLE matches_act3 PARTITION OF matches
FOR VALUES FROM ('2025-09-01') TO ('2026-01-01');
