CREATE TABLE payment_methods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    method_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE transaction_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type_code VARCHAR(30) UNIQUE NOT NULL,
    description VARCHAR(100)
);

CREATE TABLE vp_packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    vp_amount INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    bonus_vp INT DEFAULT 0
);

CREATE TABLE wallets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    balance DECIMAL(15,2) DEFAULT 0
);

CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    transaction_date DATETIME NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method_id INT,
    transaction_type_id INT,
    status VARCHAR(20),
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id),
    FOREIGN KEY (transaction_type_id) REFERENCES transaction_types(id)
);

CREATE TABLE purchases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id INT NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    item_type VARCHAR(50),
    quantity INT DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);

CREATE TABLE wallet_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wallet_id INT NOT NULL,
    transaction_id INT NOT NULL,
    vp_package_id INT NOT NULL,
    vp_amount INT NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id),
    FOREIGN KEY (transaction_id) REFERENCES transactions(id),
    FOREIGN KEY (vp_package_id) REFERENCES vp_packages(id)
);

create table transaction_errors (
    id int auto_increment primary key,
    transaction_id int not null,
    error_message varchar(255),
    created_at datetime default current_timestamp
);
