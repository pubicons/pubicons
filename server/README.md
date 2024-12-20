# Initial Settings
Create a `.env` file in the server/ folder and write the code according to the format below.

```env
POSTGRES_DB=quark
POSTGRES_PORT=5432
POSTGRES_USER=root
POSTGRES_PASSWORD=...

REDIS_PORT=6379
REDIS_PASSWORD=...{0}

EMAIL_USERNAME=pubicons.dev@gmail.com
EMAIL_PASSWORD=...
```

And then, create a `redis.conf` file in the server/ folder and write the code according to the format below.

```conf
requirepass ...{0}
```

# Get Started
Enter the following commands in turn in the terminal.

- `npm install`: installing NPM packages.
- `npm run build`: installing git submodule.
- `npm run alive`: initialing about docker compose.
- `npm run watch` or `npm run start`