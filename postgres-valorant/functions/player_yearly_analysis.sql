create or replace FUNCTION player_yearly_analysis(p_player_id INT, year INT)
RETURNS TABLE (
    avg_kills DECIMAL(5,2),
    avg_deaths DECIMAL(5,2),
    avg_assists DECIMAL(5,2),
    top_map TEXT,
    top_agent TEXT
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        ROUND(COALESCE(AVG(player_stats.kills), 0)::numeric, 2),
        ROUND(COALESCE(AVG(player_stats.deaths), 0)::numeric, 2),
        ROUND(COALESCE(AVG(player_stats.assists), 0)::numeric, 2),
        COALESCE((
            SELECT m2.name::TEXT
            FROM maps m2
            JOIN matches m3 ON m2.id = m3.map_id
            JOIN player_stats ps3 ON m3.id = ps3.match_id
            WHERE ps3.player_id = p_player_id
              AND EXTRACT(YEAR FROM m3.match_date) = year
            GROUP BY m2.id, m2.name
            ORDER BY COUNT(*) DESC
            LIMIT 1
        ), 'N/A'::TEXT),
        COALESCE((
            SELECT a.name::TEXT
            FROM agents a
            JOIN player_stats ps4 ON a.id = ps4.agent_id
            JOIN matches m4 ON ps4.match_id = m4.id
            WHERE ps4.player_id = p_player_id
              AND EXTRACT(YEAR FROM m4.match_date) = year
            GROUP BY a.id, a.name
            ORDER BY COUNT(*) DESC
            LIMIT 1
        ), 'N/A'::TEXT)
    FROM player_stats
    JOIN matches ON player_stats.match_id = matches.id
    WHERE player_stats.player_id = p_player_id
      AND EXTRACT(YEAR FROM matches.match_date) = year;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM player_yearly_analysis(1, 2023);