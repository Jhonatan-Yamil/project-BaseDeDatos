delimiter $$
create function tiene_saldo_suficiente(
    p_user_id int,
    p_monto decimal(10,2)
) returns boolean
deterministic
reads sql data
begin
    declare v_balance decimal(15,2);

    select balance into v_balance
    from wallets
    where user_id = p_user_id;
    if v_balance >= p_monto then
        return true;
    else
        return false;
    end if;
end $$
delimiter ;

select tiene_saldo_suficiente(1, 10050.00) as puede_comprar;

