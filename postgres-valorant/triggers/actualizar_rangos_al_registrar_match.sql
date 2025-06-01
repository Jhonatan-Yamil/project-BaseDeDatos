create or replace function actualizar_rangos_al_registrar_match() 
returns trigger as $$
declare
    player_id int;
    team_players int[];
    i int;
begin
    -- para el equipo ganador, sube rango a cada jugador
    select array[player_1, player_2, player_3, player_4, player_5]
    into team_players
    from teams where id = new.winning_team_id;

    for i in array_lower(team_players, 1)..array_upper(team_players, 1) loop
        player_id := team_players[i];
        perform subir_rango(player_id);
    end loop;

    -- para el equipo perdedor, baja rango a cada jugador
    select array[player_1, player_2, player_3, player_4, player_5]
    into team_players
    from teams where id = new.losing_team_id;

    for i in array_lower(team_players, 1)..array_upper(team_players, 1) loop
        player_id := team_players[i];
        perform bajar_rango(player_id);
    end loop;

    return new;
end;
$$ language plpgsql;

create trigger trigger_actualizar_rangos
after insert on matches
for each row
execute function actualizar_rangos_al_registrar_match();
