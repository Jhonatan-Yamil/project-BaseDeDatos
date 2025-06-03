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
    SELECT  COUNT(*)::integer as total_matches,SUM(CASE WHEN m.winning_team_id = t.id THEN 1 ELSE 0 END)::integer AS wins,
        SUM(CASE WHEN m.losing_team_id = t.id THEN 1 ELSE 0 END)::integer AS losses,
        ROUND(
            SUM(CASE WHEN m.winning_team_id = t.id  THEN 1 ELSE 0 END) * 100.0 / 
            NULLIF(COUNT(*), 0),
        2)::numeric AS win_rate
	from players p
	inner join teams t 
	on t.player_1 = p.id or t.player_2 = p.id or t.player_3 = p.id or t.player_4 = p.id or t.player_5 = p.id
	inner join matches m on m.winning_team_id = t.id or m.losing_team_id = t.id 
	where p.id = p_player_id;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM get_player_win_rate(406);