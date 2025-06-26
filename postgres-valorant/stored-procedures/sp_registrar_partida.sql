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
        insert into matches (map_id, match_date, duration_minutes)
        values (p_map_id, p_match_date, p_duration)
        returning id into match_id;

        insert into matches_result (match_id, winning_team_id, losing_team_id)
        values (match_id, p_winning_team_id, p_losing_team_id);

        for player_stat in select * from json_array_elements(p_player_stats)
        loop
            insert into player_stats (player_id, match_id, agent_id, team_id, kills, deaths, assists) 
            values (
                (player_stat->>'player_id')::int,
                match_id,
                (player_stat->>'agent_id')::int,
                (player_stat->>'team_id')::int,
                (player_stat->>'kills')::int,
                (player_stat->>'deaths')::int,
                (player_stat->>'assists')::int
            );
        end loop;
    exception when others then
    rollback;
            raise notice 'ocurrio un error al registrar la partida';

end;
$$;


CALL registrar_partida(
    5, 
    '2025-06-26', 
    45, 
    1, 
    2, 
    '[{"player_id": 1, "agent_id": 10, "team_id": 1, "kills": 20, "deaths": 10, "assists": 5}, 
       {"player_id": 2, "agent_id": 11, "team_id": 1, "kills": 15, "deaths": 12, "assists": 7}, 
       {"player_id": 3, "agent_id": 12, "team_id": 2, "kills": 18, "deaths": 15, "assists": 3}]'::json
);