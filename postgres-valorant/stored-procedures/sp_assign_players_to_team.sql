CREATE OR REPLACE PROCEDURE sp_assign_players_to_team(
    p_player_1 INT,
    p_player_2 INT,
    p_player_3 INT,
    p_player_4 INT,
    p_player_5 INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF p_player_1 = p_player_2 OR p_player_1 = p_player_3 OR p_player_1 = p_player_4 OR p_player_1 = p_player_5 OR
       p_player_2 = p_player_3 OR p_player_2 = p_player_4 OR p_player_2 = p_player_5 OR
       p_player_3 = p_player_4 OR p_player_3 = p_player_5 OR
       p_player_4 = p_player_5 THEN
        RAISE EXCEPTION 'Error: los jugadores asignados al equipo deben ser distintos entre sí.';
    END IF;

    BEGIN
        INSERT INTO teams (player_1, player_2, player_3, player_4, player_5)
        VALUES (p_player_1, p_player_2, p_player_3, p_player_4, p_player_5);
    EXCEPTION
        WHEN OTHERS THEN
            RAISE EXCEPTION 'Error al asignar jugadores al equipo: %', SQLERRM;
    END;
END;
$$;
--- ----- 

create or replace procedure sp_assign_players_to_team(
    p_player_1 int,
    p_player_2 int,
    p_player_3 int,
    p_player_4 int,
    p_player_5 int
)
language plpgsql
as $$
begin
    begin
        insert into teams (player_1, player_2, player_3, player_4, player_5)
        values (p_player_1, p_player_2, p_player_3, p_player_4, p_player_5);

        commit;

    exception
        when foreign_key_violation then
            rollback;
            raise exception 'error: violación de clave foránea al crear el equipo.';
        when others then
            rollback;
            raise exception 'error al asignar jugadores al equipo: %', sqlerrm;
    end;
end;
$$