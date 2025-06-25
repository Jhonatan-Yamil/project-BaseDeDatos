# Diseño de Sistema de Caché Eficiente para Operaciones Críticas

## Contexto
El sistema maneja **pagos, transacciones y billeteras**, con operaciones críticas de alta concurrencia y necesidad de rendimiento. Usaremos **Redis** como motor de caché en memoria por su velocidad y soporte nativo para expiración (TTL). Las operaciones críticas identificadas son:

- Consulta de métodos de pago
- Tipos de transacción
- Paquetes VP (`vp_packages`)
- Consulta del balance en wallets
- Rankings de jugadores (`rank_levels`, `players`)

Estas operaciones son de **lectura frecuente** y tienen **cambios poco frecuentes** o con reglas bien definidas.

## Diseño de Caché

### vp_packages en Hash
**Por qué**: Muy consultado, cambia poco.  
**Redis key**: `vp_package:{id}`  
**Tipo**: Hash  
**Contenido**:
```json
vp_package:1 => {
  "name": "Paquete Oro",
  "vp_amount": 1000,
  "price": 9.99,
  "bonus_vp": 100
}
```
**TTL**: 6 horas (o se refresca con cada edición)  
**Política de actualización**: Cache warming desde DB al detectar cambios o por TTL.

### wallets.balance como String
**Por qué**: Lectura frecuente, cambios por eventos controlados.  
**Redis key**: `wallet_balance:{user_id}`  
**Tipo**: String  
**Contenido**: `50.00` (balance en texto o decimal)  
**TTL**: 60 segundos  
**Política de actualización**: Actualización en cada `wallet_transaction` + TTL.

### payment_methods como Set
**Por qué**: Opciones fijas y muy reutilizadas.  
**Redis key**: `payment_methods`  
**Tipo**: Set (o Hash si se requieren detalles)  
**Contenido**: Lista de métodos de pago (ej. `credit_card`, `paypal`)  
**TTL**: 24 horas (o indefinido si no cambia)  
**Política de actualización**: Solo si se edita en DB.

### rank_levels (ranking) como Sorted Set
**Por qué**: Ordenable por `rank_order`.  
**Redis key**: `rank_levels`  
**Tipo**: Sorted Set  
**Contenido**: `rank_name` (valor) / `rank_order` (score)  
**TTL**: 24 horas  
**Política de actualización**: TTL + cache warming.

### Jugadores por país como Set
**Por qué**: Necesidad de filtros rápidos.  
**Redis key**: `players:by_country:{country_code}`  
**Tipo**: Set  
**Contenido**: IDs de jugadores  
**TTL**: 1 hora  
**Política de actualización**: TTL + actualización al detectar cambios.

## Justificación de TTLs y Políticas de Expiración
| Dato                | TTL sugerido | Justificación                              | Política de actualización             |
|---------------------|--------------|--------------------------------------------|---------------------------------------|
| `vp_packages`       | 6h           | Cambia poco, lectura frecuente             | Manual o TTL                          |
| `wallet_balance`    | 6h           | Cambia poco                                | TTL + actualización al escribir       |
| `payment_methods`   | 24h o indef. | Cambia casi nunca                          | Solo si se edita en DB                |
| `rank_levels`       | 24h          | Cambios raros                              | TTL + warming                         |
| `players:by_country`| 1h           | Actualización solo con cambios notables    | TTL                                   |