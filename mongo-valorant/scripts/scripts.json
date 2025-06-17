    // 1. Total de rondas y duración promedio por partida
    db.match_rounds.aggregate([
        { $unwind: "$rounds" },
        {
            $group: {
                _id: "$match_id",
                total_rounds: { $sum: 1 },
                avg_duration: { $avg: "$rounds.duration_seconds" }
                }
            },
        { $sort: { total_rounds: -1 } }
        ]);

    // 2. Jugadores con más de 1 kill y daño > 100 en una ronda con info del match
    db.player_round_stats.aggregate([
        {
            $match: {
                kills: { $gt: 1 },
                damage: { $gt: 100 }
                }
            },
        {
            $lookup: {
                from: "match_rounds",
                localField: "match_id",
                foreignField: "match_id",
                as: "round_info"
                }
            },
        {
            $project: {
                player_id: 1,
                match_id: 1,
                round_number: 1,
                kills: 1,
                damage: 1,
                team_id: 1,
                round_count: { $size: "$round_info" }
                }
            }
        ]);

    // 3. Promedio de daño y kills por jugador con configuración gráfica
    db.player_round_stats.aggregate([
        {
            $group: {
                _id: "$player_id",
                avg_damage: { $avg: "$damage" },
                avg_kills: { $avg: "$kills" }
                }
            },
        {
            $lookup: {
                from: "user_settings",
                localField: "_id",
                foreignField: "player_id",
                as: "settings"
                }
            },
        {
            $project: {
                avg_damage: 1,
                avg_kills: 1,
                graphics_quality: { $arrayElemAt: ["$settings.settings.graphics.quality", 0] },
                language: { $arrayElemAt: ["$settings.settings.language", 0] }
                }
            }
        ]);

    // 4. Total de picks por agente a partir de agent_performance_history
    db.agent_performance_history.aggregate([
        { $unwind: "$performance" },
        {
            $group: {
                _id: "$agent",
                total_picks: { $sum: 1 }
                }
            },
        { $sort: { total_picks: -1 } }
        ]);

    // 5. Top 3 agentes más usados a partir de agent_performance_history
    db.agent_performance_history.aggregate([
        { $unwind: "$performance" },
        {
            $group: {
                _id: "$agent",
                total_picks: { $sum: 1 }
                }
            },
        { $sort: { total_picks: -1 } },
        { $limit: 3 }
        ]);

    // 6. analizar el idioma y calidad gráfica preferida del jugador con más daño promedio
    db.player_round_stats.aggregate([
        {
            $group: {
                _id: "$player_id",
                avg_damage: { $avg: "$damage" },
                total_rounds: { $sum: 1 }
                }
            },
        { $sort: { avg_damage: -1 } },
        { $limit: 1 },
        {
            $lookup: {
                from: "user_settings",
                localField: "_id",
                foreignField: "player_id",
                as: "settings"
                }
            },
        { $unwind: "$settings" },
        {
            $project: {
                player_id: "$_id",
                avg_damage: 1,
                total_rounds: 1,
                language: "$settings.settings.language",
                graphics_quality: "$settings.settings.graphics.quality",
                fullscreen: "$settings.settings.graphics.fullscreen"
                }
            }
        ]);

    // 7. Total de mensajes por jugador por partida con longitud promedio
    db.match_chat_logs.aggregate([
        { $unwind: "$messages" },
        {
            $group: {
                _id: {
                    match_id: "$match_id",
                    player_id: "$messages.player_id"
                    },
                total_messages: { $sum: 1 },
                avg_message_length: { $avg: { $strLenCP: "$messages.message" } }
                }
            },
        { $sort: { total_messages: -1 } }
        ]);

    // 8. más de 1 mensajes y la cantidad de jugadores únicos que enviaron mensajes.
    db.match_chat_logs.aggregate([
        { $unwind: "$messages" },
        {
            $group: {
                _id: {
                    match_id: "$match_id",
                    player_id: "$messages.player_id"
                    },
                mensajes: { $sum: 1 }
                }
            },
        {
            $group: {
                _id: "$_id.match_id",
                total_mensajes: { $sum: "$mensajes" },
                jugadores_unicos: { $sum: 1 }
                }
            },
        {
            $match: {
                total_mensajes: { $gt: 1 }
                }
            },
        {
            $project: {
                match_id: "$_id",
                total_mensajes: 1,
                jugadores_unicos: 1,
                _id: 0
                }
            }
        ]);

    // 9. Total de VP ganados en recompensas por jugador
    db.daily_login_rewards.aggregate([
        { $unwind: "$rewards" },
        {
            $group: {
                _id: "$player_id",
                total_vp: { $sum: "$rewards.vp_rewarded" },
                days_rewarded: { $sum: 1 }
                }
            },
        { $sort: { total_vp: -1 } }
        ]);

    // 10. Fechas únicas y total de días con recompensa por jugador
    db.daily_login_rewards.aggregate([
        { $unwind: "$rewards" },
        {
            $group: {
                _id: "$player_id",
                fechas: { $addToSet: "$rewards.date" }
                }
            },
        {
            $addFields: {
                total_days: { $size: "$fechas" }
                }
            }
        ]);

    // 11. Jugadores con mayor daño promedio por ronda (con nombre de jugador)
    db.player_round_stats.aggregate([
        {
            $group: {
                _id: "$player_id",
                avg_damage: { $avg: "$damage" }
                }
            },
        {
            $lookup: {
                from: "user_settings",
                localField: "_id",
                foreignField: "player_id",
                as: "user_info"
                }
            },
        { $unwind: "$user_info" },
        {
            $project: {
                player_id: "$_id",
                avg_damage: 1,
                language: "$user_info.settings.language"
                }
            },
        { $sort: { avg_damage: -1 } }
        ]);


    // 12. Total de VP ganado y días logueados por jugador (sin usar $divide)
    db.daily_login_rewards.aggregate([
        { $unwind: "$rewards" },
        {
            $group: {
                _id: "$player_id",
                total_vp: { $sum: "$rewards.vp_rewarded" },
                days_logged: { $sum: 1 }
                }
            },
        {
            $project: {
                player_id: "$_id",
                total_vp: 1,
                days_logged: 1
                }
            },
        { $sort: { total_vp: -1 } }
        ]);

    // 13. Promedio de mensajes por jugador con detalle de configuración
    db.match_chat_logs.aggregate([
        { $unwind: "$messages" },
        {
            $group: {
                _id: "$messages.player_id",
                total_messages: { $sum: 1 }
                }
            },
        {
            $lookup: {
                from: "user_settings",
                localField: "_id",
                foreignField: "player_id",
                as: "user_info"
                }
            },
        { $unwind: "$user_info" },
        {
            $project: {
                player_id: "$_id",
                total_messages: 1,
                language: "$user_info.settings.language",
                graphics: "$user_info.settings.graphics.quality"
                }
            },
        { $sort: { total_messages: -1 } }
        ]);

    // 14. Número de rondas ganadas por cada equipo
    db.match_rounds.aggregate([
        { $unwind: "$rounds" },
        {
            $group: {
                _id: "$rounds.winning_team",
                wins: { $sum: 1 }
                }
            },
        { $sort: { wins: -1 } }
        ]);

    // 15. Jugadores con más asistencias totales por agente
    db.agent_performance_history.aggregate([
        { $unwind: "$performance" },
        {
            $group: {
                _id: {
                    player_id: "$player_id",
                    agent: "$agent"
                    },
                total_assists: { $sum: "$performance.assists" }
                }
            },
        { $sort: { total_assists: -1 } }
        ]);

    // 16. Conteo de tipos de issues en soporte (open vs closed vs pending)
    db.support_tickets.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
                }
            }
        ]);

    // 17. Jugadores con feedback de tipo "bug" y sus configuraciones
    db.feedbacks.aggregate([
        { $match: { feedback_type: "bug" } },
        {
            $lookup: {
                from: "user_settings",
                localField: "player_id",
                foreignField: "player_id",
                as: "user_info"
                }
            },
        { $unwind: "$user_info" },
        {
            $project: {
                player_id: 1,
                feedback_text: 1,
                submitted_at: 1,
                language: "$user_info.settings.language",
                graphics_quality: "$user_info.settings.graphics.quality"
                }
            }
        ]);

    // 18. Estadísticas promedio por ronda por agente (usando player_round_stats + agent_performance_history)
    db.player_round_stats.aggregate([
        {
            $lookup: {
                from: "agent_performance_history",
                localField: "player_id",
                foreignField: "player_id",
                as: "agent_info"
                }
            },
        { $unwind: "$agent_info" },
        {
            $group: {
                _id: "$agent_info.agent",
                avg_kills: { $avg: "$kills" },
                avg_damage: { $avg: "$damage" }
                }
            },
        { $sort: { avg_kills: -1 } }
        ]);

    // 19. Jugadores con problemas de conexión o rendimiento
    db.support_tickets.aggregate([
        {
            $match: {
                $or: [
                    { issue_type: "connectivity_issue" },
                    { issue_type: "performance_issue" }
                    ]
                }
            },
        {
            $lookup: {
                from: "user_settings",
                localField: "player_id",
                foreignField: "player_id",
                as: "user_info"
                }
            },
        { $unwind: "$user_info" },
        {
            $project: {
                player_id: 1,
                issue_type: 1,
                status: 1,
                language: "$user_info.settings.language",
                fullscreen: "$user_info.settings.graphics.fullscreen"
                }
            }
        ]);

    // 20. Recompensas acumuladas por jugadores que tienen configurado idioma inglés
    db.user_settings.aggregate([
        { $match: { "settings.language": "en" } },
        {
            $lookup: {
                from: "daily_login_rewards",
                localField: "player_id",
                foreignField: "player_id",
                as: "login_data"
                }
            },
        { $unwind: "$login_data" },
        { $unwind: "$login_data.rewards" },
        {
            $group: {
                _id: "$player_id",
                total_vp: { $sum: "$login_data.rewards.vp_rewarded" }
                }
            },
        { $sort: { total_vp: -1 } }
        ]);