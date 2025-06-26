delimiter $$
create procedure realizar_compra_vp(
    in p_user_id int,
    in p_vp_package_id int,
    in p_payment_method_id int
)
begin
    declare v_wallet_id int;
    declare v_price decimal(10,2);
    declare v_vp_amount int;
    declare v_bonus_vp int;
    declare v_transaction_id int;

    -- manejo de errores
    declare exit handler for sqlexception
    begin
        rollback;
    end;

    start transaction;

    -- obtiene datos del paquete vp
    select price, vp_amount, bonus_vp
    into v_price, v_vp_amount, v_bonus_vp
    from vp_packages
    where id = p_vp_package_id;

    -- obtiene wallet del usuario
    select id into v_wallet_id
    from wallets
    where user_id = p_user_id;

    -- inserta transacción
    insert into transactions (
        user_id, transaction_date, amount, payment_method_id, transaction_type_id, status
    )
    values (
        p_user_id, now(), v_price, p_payment_method_id, 1, 'completado'
    );

    set v_transaction_id = last_insert_id();

    -- actualiza balance del wallet
    update wallets
    set balance = balance + v_vp_amount + v_bonus_vp
    where id = v_wallet_id;

    -- registra detalle en wallet_transactions
    insert into wallet_transactions (
        wallet_id, transaction_id, vp_package_id, vp_amount, created_at
    )
    values (
        v_wallet_id, v_transaction_id, p_vp_package_id, v_vp_amount + v_bonus_vp, now()
    );

    commit;
end $$
delimiter ;

CALL realizar_compra_vp(10, 3, 2);
