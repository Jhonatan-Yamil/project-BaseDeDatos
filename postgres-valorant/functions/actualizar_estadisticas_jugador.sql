create or replace function actualizar_estadisticas_jugador(
    p_player_id int,
    p_match_id int,
    p_kills int,
    p_deaths int,
    p_assists int
)
returns void as $$
begin
    update player_stats
    set kills = p_kills,
        deaths = p_deaths,
        assists = p_assists
    where player_id = p_player_id
      and match_id = p_match_id;
      
    if not found then
        -- si no existe, inserta nuevo registro del jugador
        insert into player_stats (player_id, match_id, kills, deaths, assists)
        values (p_player_id, p_match_id, p_kills, p_deaths, p_assists);
    end if;
end;
$$ language plpgsql;


select actualizar_estadisticas_jugador(1, 10, 15, 3, 5);
