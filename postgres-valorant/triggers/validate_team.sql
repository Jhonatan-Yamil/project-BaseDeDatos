create or replace function validate_team()
returns trigger as $$
begin
    if not exists (select 1 from players where id = new.player_1) or
       not exists (select 1 from players where id = new.player_2) or
       not exists (select 1 from players where id = new.player_3) or
       not exists (select 1 from players where id = new.player_4) or
       not exists (select 1 from players where id = new.player_5) then
        raise exception 'uno o más jugadores no existen en la tabla players';
    end if;

    if new.player_1 = new.player_2 or new.player_1 = new.player_3 or new.player_1 = new.player_4 or new.player_1 = new.player_5 or
       new.player_2 = new.player_3 or new.player_2 = new.player_4 or new.player_2 = new.player_5 or
       new.player_3 = new.player_4 or new.player_3 = new.player_5 or
       new.player_4 = new.player_5 then
        raise exception 'los jugadores en el equipo deben ser únicos';
    end if;

    return new;
end;
$$ language plpgsql;

create trigger trg_validate_team
before insert or update on teams
for each row
execute function validate_team();