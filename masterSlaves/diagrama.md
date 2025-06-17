# Diagrama de Arquitectura PostgreSQL con Replicación

```plaintext
                         +----------------------+
                         |  postgres_exporter   |
                         | (Monitorea Primary)  |
                         +----------+-----------+
                                    |
                                    v
                          http://localhost:9187

                         +----------------------+
                         |  postgres_primary    |
                         |   (Puerto 55432)     |
                         |   Modo: MASTER       |
                         |   DB: postgres       |
                         +----------+-----------+
                                    |
     ------------------------------+-------------------------------
     |                                                         |
     v                                                         v
+---------------------+                          +----------------------+
| postgres_replica_1  |                          | postgres_replica_2   |
|   (Puerto 5433)     |                          |   (Puerto 5434)      |
|   Modo: SLAVE       |                          |   Modo: SLAVE        |
| Sync desde master   |                          | Sync desde master    |
+---------------------+                          +----------------------+