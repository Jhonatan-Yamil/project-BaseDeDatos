delimiter $$
create trigger actualizar_estado_fallo_pago
after update on transactions
for each row
begin
    if old.status != new.status and new.status = 'fallido' then
        -- TODO: Ver si solo para método tarjeta de crédito (id = 1)
        if new.payment_method_id = 1 then
            insert into transaction_errors(transaction_id, error_message)
            values (new.id, concat('Pago rechazado para transacción ', new.id));
        end if;
    end if;
end$$
delimiter ;
