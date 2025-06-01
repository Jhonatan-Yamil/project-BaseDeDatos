-- Estadisticas de jugadores, incluyendo partidas jugadas, kills, deaths, assists y KDA promedio.
-- Ayuda a analizar el rendimiento de los jugadores, identificar jugadores destacados y mejorar estrategias de juego.
create view vista_estadisticas_jugadores as
select 
    p.username,
    count(ps.id) as partidas_jugadas,
    sum(ps.kills) as total_kills,
    sum(ps.deaths) as total_deaths,
    sum(ps.assists) as total_assists,
    round(avg(ps.kills::numeric), 2) as promedio_kills,
    round(avg(ps.deaths::numeric), 2) as promedio_deaths,
    round(avg(ps.assists::numeric), 2) as promedio_assists,
    round(avg((ps.kills + ps.assists)::numeric / nullif(ps.deaths, 0)), 2) as promedio_kda
from players p
join player_stats ps on p.id = ps.player_id
group by p.username;
