DELIMITER $$

CREATE TRIGGER trg_complete_transaction_on_wallet_transaction
AFTER INSERT ON wallet_transactions
FOR EACH ROW
BEGIN
    UPDATE transactions
    SET status = 'completed'
    WHERE id = NEW.transaction_id AND status <> 'completed';
END$$

DELIMITER ;