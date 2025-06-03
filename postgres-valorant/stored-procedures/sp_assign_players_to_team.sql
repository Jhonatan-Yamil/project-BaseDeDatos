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