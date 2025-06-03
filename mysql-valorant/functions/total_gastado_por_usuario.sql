DROP FUNCTION IF EXISTS total_gastado_por_usuario;

DELIMITER //

CREATE FUNCTION total_gastado_por_usuario(p_user_id INT)
RETURNS DECIMAL(10,2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE total DECIMAL(10,2);
    SELECT SUM(amount) INTO total
    FROM transactions
    WHERE user_id = p_user_id;
    RETURN IFNULL(total, 0);
END;
//

DELIMITER ;

SELECT total_gastado_por_usuario(1);
