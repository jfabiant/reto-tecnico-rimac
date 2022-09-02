# Reto Tecnico Rimac

-Author: John Fabian Timoteo Torres

## End-points integrando la API de SWAPI (2 end-points) y traduciendo campos a español

https://lc93fee9v2.execute-api.us-west-2.amazonaws.com/sw/planets (Acceso mediante método GET)

https://lc93fee9v2.execute-api.us-west-2.amazonaws.com/sw/vehicles (Acceso mediante método GET)

## Modelo Producto creado en base de datos DynamoDB

### Endpoint 1:

https://lc93fee9v2.execute-api.us-west-2.amazonaws.com/products

Métodos:
GET -> Lista los productos.
POST -> Crea un producto o edita un producto si se le envia el parámetro id en el cuerpo JSON.

Input:

> {
> "name": "Celular Huawei 33",
> "price": 800
> }

Output:

> {
> "code": "00",
> "details": {
> "id": "81b2c91a-65a2-4af0-bd59-41d2005300ae",
> "name": "Celular Huawei 33",
> "price": 800,
> "created_at": "2022-09-02T04:37:34.872Z"
> }
> }

### Endpoint 2:

https://lc93fee9v2.execute-api.us-west-2.amazonaws.com/products/${id}

Métodos:
GET -> Encuentra un producto por id.

Output:

> {
> "code": "00",
> "details": {
> "created_at": {},
> "id": "81b2c91a-65a2-4af0-bd59-41d2005300ae",
> "price": 800,
> "name": "Celular Huawei 33"
> }
> }

### Endpoint 3:

https://lc93fee9v2.execute-api.us-west-2.amazonaws.com/products/${id}

Métodos:
DELETE -> Elimina un producto por id.

> {
> "code": "00",
> "details": "Producto eliminado satisfactoriamente"
> }
