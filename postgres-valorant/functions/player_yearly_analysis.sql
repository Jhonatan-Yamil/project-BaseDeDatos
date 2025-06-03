create function player_yearly_analysis (player_id int, year int)
returns text
as $$
begin
    return (
        select 
            'Kills: ' || coalesce(cast(avg(cast(ps.kills as decimal(5,2))) as text), '0') || 
            ', Deaths: ' || coalesce(cast(avg(cast(ps.deaths as decimal(5,2))) as text), '0') || 
            ', Assists: ' || coalesce(cast(avg(cast(ps.assists as decimal(5,2))) as text), '0') ||
            ', Top Map: ' || coalesce((
                select m2.name 
                from maps m2 
                join matches m3 on m2.id = m3.map_id 
                join player_stats ps3 on m3.id = ps3.match_id 
                where ps3.player_id = player_id 
                and extract(year from m3.match_date) = year 
                group by m2.id, m2.name 
                order by count(*) desc 
                limit 1
            ), 'N/A') || 
            ', Top Agent: ' || coalesce((
                select a.name 
                from agents a 
                join player_stats ps4 on a.id = ps4.agent_id 
                join matches m4 on ps4.match_id = m4.id 
                where ps4.player_id = player_id 
                and extract(year from m4.match_date) = year 
                group by a.id, a.name 
                order by count(*) desc 
                limit 1
            ), 'N/A')
        from player_stats ps
        join matches m on ps.match_id = m.id
        where ps.player_id = player_id
        and extract(year from m.match_date) = year
    );
end;
$$ LANGUAGE plpgsql;
    