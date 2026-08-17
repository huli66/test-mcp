import {serve} from '@hono/node-server';
import {Hono} from 'hono';
import {jwtMiddleWare} from './jwt-middleware';

const app = new Hono();

app.use(jwtMiddleWare);

app.get('/', (c) => {
  return c.json({
    message: 'Hello Hono!'
  });
});

app.get('/users/:id', (c) => {
  const id = c.req.param('id');

  return c.json({
    id,
    name: `User ${id}`
  });
});

app.post('/users', async (c) => {
  const body = await c.req.json<{name: string}>();

  return c.json(
    {
      id: crypto.randomUUID(),
      name: body.name
    },
    201
  );
});

app.notFound((c) => {
  return c.json({message: 'Not Found'}, 404);
});

app.onError((error, c) => {
  console.error(error.message);
  return c.json({message: 'Internal Server Error'}, 500);
});

const port = Number(process.env.PORT ?? 3000);

const server = serve({
  fetch: app.fetch,
  port
});

console.log(`Server running at http://localhost:${port}`);

function shutdown(signal: string) {
  console.log(`Received ${signal}, shutting down...`);

  server.close((error) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }

    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
