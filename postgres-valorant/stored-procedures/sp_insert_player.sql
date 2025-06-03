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