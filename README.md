# Trading

```bash
docker run --name trading-redis -d redis
```

```bash
docker run -d \
    --name trading \
    --network="host" \
    -e POSTGRES_PASSWORD=admin  \
    -e POSTGRES_USER=admin  \
    -e POSTGRES_DB=trading \
    -p 5433:5432 \
    postgres
```
