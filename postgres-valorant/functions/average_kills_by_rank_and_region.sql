create function f_average_kills_by_rank_and_region (rank_id INT, region_id INT)
returns DECIMAL(10,2)
as $$
begin
    return (
        select AVG(CAST(ps.kills AS DECIMAL(10,2)))
        from player_stats ps
        join players p on ps.player_id = p.id
        where p.rank_id = rank_id
        and p.regions = region_id
        and ps.kills is not null
    );
end;
$$ language plpgsql;