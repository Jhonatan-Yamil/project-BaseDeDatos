--Resumen limpio y legible de todas las transacciones realizadas, incluyendo método de pago y tipo de transacción.
--Ayuda a Generar reportes financieros, analizar qué métodos de pago son más usados,  detectar transacciones fallidas 
create view vista_transacciones_completas as
select 
    t.id as transaction_id,
    t.user_id,
    t.transaction_date,
    t.amount,
    pm.method_name as payment_method,
    tt.type_code as transaction_type,
    t.status
from transactions t
left join payment_methods pm on t.payment_method_id = pm.id
left join transaction_types tt on t.transaction_type_id = tt.id;
