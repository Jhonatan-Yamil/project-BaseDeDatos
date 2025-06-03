CREATE OR REPLACE VIEW view_map_player_stats AS
SELECT
    ps.player_id,
    p.username,
    ps.match_id,
    m.match_date,
    mp.name AS map_name,
    ag.name AS agent_name,
    r.name AS agent_role,
    ps.kills,
    ps.deaths,
    ps.assists
FROM player_stats ps
JOIN players p ON ps.player_id = p.id
JOIN matches m ON ps.match_id = m.id
JOIN maps mp ON m.map_id = mp.id
JOIN agents ag ON ps.agent_id = ag.id
JOIN rol r ON ag.role = r.id;