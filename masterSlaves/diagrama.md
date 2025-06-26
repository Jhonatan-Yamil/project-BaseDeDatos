# Diagrama de Arquitectura MySql con Replicación

```plaintext
                         +----------------------+
                         |    mysql_exporter    |
                         |  (Monitorea Master)  |
                         +----------+-----------+
                                    |
                                    v
                         +----------------------+
                         |    mysql_master      |
                         |     (Puerto 3306)    |
                         |      Modo: MASTER    |
                         |    DB: valorant      |
                         +----------+-----------+
                                    |
     ------------------------------+-------------------------------
     |                                                         |
     v                                                         v
+---------------------+                          +---------------------+
|    mysql_slave1     |                          |    mysql_slave2     |
|    (Puerto 3307)    |                          |    (Puerto 3308)    |
|     Modo: SLAVE     |                          |     Modo: SLAVE     |
|   Sync desde master |                          |   Sync desde master |
+---------------------+                          +---------------------+
