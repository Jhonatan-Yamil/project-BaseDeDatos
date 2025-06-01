create or replace procedure registrar_partida(
    in p_map_id int,
    in p_match_date date,
    in p_duration int,
    in p_winning_team_id int,
    in p_losing_team_id int,
    in p_player_stats json
)
language plpgsql
as $$
declare
    match_id int;
    player_stat json;
begin
    insert into matches (map_id, match_date, duration_minutes, winning_team_id, losing_team_id)
    values (p_map_id, p_match_date, p_duration, p_winning_team_id, p_losing_team_id)
    returning id into match_id;

    -- Recorre el JSON con las estadísticas individuales
    for player_stat in select * from json_array_elements(p_player_stats)
    loop
        insert into player_stats (
            player_id, match_id, agent_id, team_id, kills, deaths, assists
        ) values (
            (player_stat->>'player_id')::int,
            match_id,
            (player_stat->>'agent_id')::int,
            (player_stat->>'team_id')::int,
            (player_stat->>'kills')::int,
            (player_stat->>'deaths')::int,
            (player_stat->>'assists')::int
        );
    end loop;
end;
$$;

call registrar_partida(
    1,
    '2025-05-30',
    40,
    4,
    5,
    '[
        {"player_id": 1, "agent_id": 2, "team_id": 4, "kills": 10, "deaths": 5, "assists": 2},
        {"player_id": 2, "agent_id": 3, "team_id": 4, "kills": 12, "deaths": 4, "assists": 3},
        {"player_id": 3, "agent_id": 1, "team_id": 5, "kills": 8, "deaths": 7, "assists": 1}
        -- TODO: Agregar los 7 siguientes jugadores con sus estadísticas correspondientes
    ]'::json
);

