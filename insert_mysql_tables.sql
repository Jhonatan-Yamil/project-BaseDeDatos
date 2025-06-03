INSERT INTO payment_methods (method_name, description) VALUES
('Credit Card', 'Pago con tarjeta de crédito'),
('Debit Card', 'Pago con tarjeta de débito'),
('PayPal', 'Pago usando PayPal')

INSERT INTO transaction_types (type_code, description) VALUES
('PURCHASE', 'Compra de productos o servicios'),
('TOPUP', 'Recarga de saldo o VP'),
('WITHDRAW', 'Retiro de fondos'),
('BONUS', 'Bono promocional o regalo')

INSERT INTO vp_packages (name, vp_amount, price, bonus_vp) VALUES
('Starter Pack', 100, 1.99, 0),
('Silver Pack', 500, 8.99, 50),
('Gold Pack', 1000, 16.99, 150),
('Platinum Pack', 2500, 39.99, 500),
('Mega Pack', 5000, 74.99, 1200);