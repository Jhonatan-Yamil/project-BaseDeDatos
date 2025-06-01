create or replace function subir_rango(p_player_id int) 
returns void as $$
declare
    current_rank_id int;
    current_rank_order int;
    next_rank_id int;
begin
    select rank_id into current_rank_id from players where id = p_player_id;
    if current_rank_id is null then
        return; -- jugador sin rango asignado, no hace nada
    end if;

    select rank_order into current_rank_order from rank_levels where id = current_rank_id;

    -- busca siguiente rango con rank_order mayor que el actual
    select id into next_rank_id from rank_levels
    where rank_order > current_rank_order
    order by rank_order asc
    limit 1;

    if next_rank_id is not null then
        update players set rank_id = next_rank_id, update_date = current_timestamp where id = p_player_id;
    end if;
end;
$$ language plpgsql;

select subir_rango(1);
