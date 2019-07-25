#mowver-mqtt

## `agent/connected`
``` js
{
    agent : {
        uuid, //Auto generado
        username, //Se define por configuración
        name, //Se define por configuración
        hostname,// del O.S
        pid // Del proceso
    }
}
```
## `agent/disconnected`
``` js
{
    agent : {
        uuid
    }
}
```
## `agent/message`
``` js
{
    agent,
    metrics : [
        {
            type,
            value
        }
    ],
    timestamp //generar cuando se crea el mensaje
}
```