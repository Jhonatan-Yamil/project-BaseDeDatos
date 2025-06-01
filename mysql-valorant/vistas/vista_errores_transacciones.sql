-- Muestra los errores registrados por el trigger cuando una transacción falla, junto con el usuario afectado.
-- Ayuda a monitorear y auditar problemas frecuentes en los pagos,  identificar usuarios con múltiples errores (posible fraude o problemas técnicos).
create view vista_errores_transacciones as
-- TODO: Ver si se puede agregar el nombre del usuario afectado y no solo el id.
select
    e.id,
    e.transaction_id,
    t.user_id, 
    e.error_message,
    e.created_at
from transaction_errors e
join transactions t on e.transaction_id = t.id;
