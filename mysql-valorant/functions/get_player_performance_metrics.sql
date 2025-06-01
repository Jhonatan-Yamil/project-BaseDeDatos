CREATE OR REPLACE FUNCTION get_player_performance_metrics(p_player_id INT)
RETURNS TABLE (
    total_matches BIGINT,
    avg_kills NUMERIC,
    avg_deaths NUMERIC,
    avg_assists NUMERIC,
    kda_ratio NUMERIC,
    avg_acs NUMERIC,
    estimated_mmr NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*) AS total_matches,
        ROUND(AVG(kills), 2) AS avg_kills,
        ROUND(AVG(deaths), 2) AS avg_deaths,
        ROUND(AVG(assists), 2) AS avg_assists,
        ROUND(
            CASE 
                WHEN SUM(deaths) = 0 THEN NULL
                ELSE (SUM(kills) + SUM(assists))::NUMERIC / NULLIF(SUM(deaths), 0)
            END, 2
        ) AS kda_ratio,
        ROUND(AVG(kills * 2 + assists - deaths), 2) AS avg_acs,
        ROUND(
            ((SUM(kills) + SUM(assists))::NUMERIC / NULLIF(SUM(deaths), 0)) * 100 
            + AVG(kills * 2 + assists - deaths), 2
        ) AS estimated_mmr
    FROM player_stats
    WHERE player_id = p_player_id;
END;
$$ LANGUAGE plpgsql;


SELECT * FROM get_player_performance_metrics(406);