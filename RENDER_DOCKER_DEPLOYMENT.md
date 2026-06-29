# Render Docker Deployment

This app deploys to Render with a Docker runtime instead of Render's native Node runtime.

## Why Docker

The deployment image pins the runtime to Node.js 20 and installs dependencies with `npm ci`.
This avoids Render guessing the wrong runtime or compiling unrelated system dependencies during deployment.

## Render settings

The blueprint in `render.yaml` uses:

- `env: docker`
- `dockerfilePath: ./Dockerfile`
- `dockerContext: .`
- `healthCheckPath: /api/health`

The health check intentionally avoids database calls so Render can verify the container is alive even if the database is cold or temporarily unreachable.

## Required environment variables

Set these in Render:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

Render can generate `NEXTAUTH_SECRET` from the blueprint. `NEXTAUTH_URL` should be the deployed service URL, for example `https://your-service.onrender.com`.

## Local verification

When Docker Desktop is running, build the image with:

```bash
docker build -t exam-vaults-render-test .
```

Run it locally with:

```bash
docker run --rm -p 10000:10000 --env-file .env.local exam-vaults-render-test
```

Then check:

```bash
curl http://localhost:10000/api/health
```
