DELIMITER $$

CREATE PROCEDURE sp_refund_transaction (
    IN p_transaction_id INT
)
BEGIN
    DECLARE v_wallet_id INT;
    DECLARE v_vp_amount INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error processing refund';
    END;

    START TRANSACTION;

    -- Obtener datos
    SELECT wallet_id, vp_amount INTO v_wallet_id, v_vp_amount
    FROM wallet_transactions
    WHERE transaction_id = p_transaction_id;

    -- Reembolsar VP
    UPDATE wallets SET balance = balance + v_vp_amount
    WHERE id = v_wallet_id;

    -- Marcar como reembolsado
    UPDATE transactions SET status = 'refunded'
    WHERE id = p_transaction_id;

    COMMIT;
END$$

DELIMITER ;


CALL sp_refund_transaction(2);
