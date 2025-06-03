CREATE OR REPLACE FUNCTION get_player_win_rate(p_player_id integer)
RETURNS TABLE (
    total_matches integer,
    wins integer,
    losses integer,
    win_rate numeric
)
AS $$
BEGIN
    RETURN QUERY
    SELECT  COUNT(*)::integer as total_matches,SUM(CASE WHEN m.winning_team_id = t.id THEN 1 ELSE 0 END)::integer AS wins,
        SUM(CASE WHEN m.losing_team_id = t.id THEN 1 ELSE 0 END)::integer AS losses,
        ROUND(
            SUM(CASE WHEN m.winning_team_id = t.id  THEN 1 ELSE 0 END) * 100.0 / 
            NULLIF(COUNT(*), 0),
        2)::numeric AS win_rate
	from players p
	inner join teams t 
	on t.player_1 = p.id or t.player_2 = p.id or t.player_3 = p.id or t.player_4 = p.id or t.player_5 = p.id
	inner join matches m on m.winning_team_id = t.id or m.losing_team_id = t.id 
	where p.id = p_player_id;
END;
$$ LANGUAGE plpgsql;



SELECT * FROM get_player_win_rate(406);


CREATE OR REPLACE FUNCTION get_player_performance_metrics(p_player_id INT)
RETURNS TABLE (
    total_matches BIGINT,
    avg_kills NUMERIC,
    avg_deaths NUMERIC,
    avg_assists NUMERIC,
    kda_ratio NUMERIC,
    avg_acs NUMERIC,
    estimated_mmr NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*) AS total_matches,
        ROUND(AVG(kills), 2) AS avg_kills,
        ROUND(AVG(deaths), 2) AS avg_deaths,
        ROUND(AVG(assists), 2) AS avg_assists,
        ROUND(
            CASE 
                WHEN SUM(deaths) = 0 THEN NULL
                ELSE (SUM(kills) + SUM(assists))::NUMERIC / NULLIF(SUM(deaths), 0)
            END, 2
        ) AS kda_ratio,
        ROUND(AVG(kills * 2 + assists - deaths), 2) AS avg_acs,
        ROUND(
            ((SUM(kills) + SUM(assists))::NUMERIC / NULLIF(SUM(deaths), 0)) * 100 
            + AVG(kills * 2 + assists - deaths), 2
        ) AS estimated_mmr
    FROM player_stats
    WHERE player_id = p_player_id;
END;
$$ LANGUAGE plpgsql;


SELECT * FROM get_player_performance_metrics(406);

CREATE TABLE IF NOT EXISTS info_players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    player_id INT NOT NULL UNIQUE REFERENCES players(id),
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table rank_levels (
    id serial primary key,
    rank_name varchar(20) not null unique,
    rank_order int not null unique
);

-- ----------------------------------------------
CREATE OR REPLACE PROCEDURE sp_insert_player(
    IN p_username VARCHAR,
    IN p_rank_id INT,
    IN p_level INT,
    IN p_country INT,
    IN p_region INT,
    IN p_name VARCHAR,
    IN p_email VARCHAR,
    IN p_password VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    new_player_id INT;
    email_exists INT;
    username_exists INT;
BEGIN
    BEGIN
        -- Validar si el email ya existe
        SELECT COUNT(*) INTO email_exists
        FROM info_players
        WHERE email = p_email;

        IF email_exists > 0 THEN
            RAISE EXCEPTION 'El email % ya está registrado.', p_email;
        END IF;

        -- Validar si el username ya existe
        SELECT COUNT(*) INTO username_exists
        FROM players
        WHERE username = p_username;

        IF username_exists > 0 THEN
            RAISE EXCEPTION 'El nombre de usuario % ya está registrado.', p_username;
        END IF;

        -- Insertar en players
        INSERT INTO players (username, rank_id, level, country, regions)
        VALUES (p_username, p_rank_id, p_level, p_country, p_region)
        RETURNING id INTO new_player_id;

        -- Insertar en info_players
        INSERT INTO info_players (name, email, password, player_id)
        VALUES (p_name, p_email, p_password, new_player_id);

    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Ocurrió un error al insertar el jugador: %', SQLERRM;
        -- No usamos ROLLBACK aquí porque no estamos en una transacción explícita
    END;
END;
$$;

-- ---------------------


CREATE OR REPLACE FUNCTION trg_validate_email()
RETURNS TRIGGER AS $$
DECLARE
    email_count INT;
BEGIN
    -- Verificar que el email no exista en otro registro
    SELECT COUNT(*) INTO email_count
    FROM info_players
    WHERE email = NEW.email
      AND id <> COALESCE(NEW.id, 0);

    IF email_count > 0 THEN
        RAISE EXCEPTION 'El email % ya está registrado en otro usuario.', NEW.email;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_email_format_check
BEFORE INSERT OR UPDATE ON info_players
FOR EACH ROW
EXECUTE FUNCTION trg_validate_email();

