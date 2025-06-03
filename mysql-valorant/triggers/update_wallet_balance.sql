create or replace function update_wallet_balance()
returns trigger as $$
begin
    update wallets
    set balance = balance + new.vp_amount
    where id = new.wallet_id;

    return new;
end;
$$ language plpgsql;

create trigger trg_update_wallet_balance
after insert or update on wallet_transactions
for each row
execute function update_wallet_balance();