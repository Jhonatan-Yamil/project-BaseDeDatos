create or replace procedure sp_delete_player(
    p_player_id int
)
language plpgsql
as $$
begin
    begin
        if not exists (select 1 from players where id = p_player_id) then
            raise exception 'error: el jugador con id % no existe.', p_player_id;
        end if;

        if exists (
            select 1 from teams 
            where player_1 = p_player_id 
            or player_2 = p_player_id 
            or player_3 = p_player_id 
            or player_4 = p_player_id 
            or player_5 = p_player_id
        ) then
            raise exception 'error: el jugador con id % está en un equipo y no puede ser eliminado.', p_player_id;
        end if;

        delete from player_player_stats 
        where player_id = p_player_id 
        or opponent_id = p_player_id;

        delete from player_stats 
        where player_id = p_player_id;

        delete from info_players 
        where player_id = p_player_id;

        delete from players 
        where id = p_player_id;

        commit;

    exception
        when foreign_key_violation then
            rollback;
            raise exception 'error: no se puede eliminar el jugador %', p_player_id;
    end;
end;
$$