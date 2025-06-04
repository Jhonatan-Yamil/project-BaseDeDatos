EXPLAIN (ANALYZE)
SELECT 
    p.username,
    ROUND(AVG((ps.kills + ps.assists)::numeric / NULLIF(ps.deaths, 0)), 2) AS avg_kda
FROM player_stats ps
JOIN players p ON ps.player_id = p.id
JOIN matches m ON ps.match_id = m.id
WHERE m.match_date BETWEEN '2025-01-01' AND '2025-12-31'
GROUP BY p.id
ORDER BY avg_kda DESC
LIMIT 10; --46.456 y 145.435


CREATE INDEX idx_matches_date ON matches(match_date);

CREATE INDEX idx_player_stats_match_player ON player_stats(match_id, player_id);

CREATE INDEX idx_players_id_username ON players(id, username); -- 5.021,40.402


EXPLAIN (ANALYZE)
SELECT 
    player_id,
    opponent_id,
    SUM(kills) AS total_kills,
    SUM(deaths) AS total_deaths
FROM player_player_stats
WHERE (player_id = 10 AND opponent_id = 20)
   OR (player_id = 20 AND opponent_id = 10)
GROUP BY player_id, opponent_id; --15.938, 29.406 


CREATE INDEX idx_pps_players_match ON player_player_stats(player_id, opponent_id, match_id); -- 2.686, 1.505