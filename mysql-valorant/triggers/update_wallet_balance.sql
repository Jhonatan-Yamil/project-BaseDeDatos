delimiter //

create trigger trg_update_wallet_balance
after insert on wallet_transactions
for each row
begin
    update wallets
    set balance = balance + new.vp_amount
    where id = new.wallet_id;
end;//

delimiter ;