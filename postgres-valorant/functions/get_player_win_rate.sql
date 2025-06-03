CREATE OR REPLACE FUNCTION get_player_win_rate(p_player_id integer)
RETURNS TABLE (
    total_matches integer,
    wins integer,
    losses integer,
    win_rate numeric
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::integer AS total_matches,
        SUM(CASE WHEN mr.winning_team_id = t.id THEN 1 ELSE 0 END)::integer AS wins,
        SUM(CASE WHEN mr.losing_team_id = t.id THEN 1 ELSE 0 END)::integer AS losses,
        ROUND(
            SUM(CASE WHEN mr.winning_team_id = t.id THEN 1 ELSE 0 END) * 100.0 / 
            NULLIF(COUNT(*), 0),
        2)::numeric AS win_rate
    FROM players p
    INNER JOIN teams t ON 
        t.player_1 = p.id OR 
        t.player_2 = p.id OR 
        t.player_3 = p.id OR 
        t.player_4 = p.id OR 
        t.player_5 = p.id
    INNER JOIN matches_result mr ON 
        mr.winning_team_id = t.id OR mr.losing_team_id = t.id
    WHERE p.id = p_player_id;
END;
$$ LANGUAGE plpgsql;


SELECT * FROM get_player_win_rate(406);