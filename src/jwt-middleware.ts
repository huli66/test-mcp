import type {MiddlewareHandler} from 'hono';

export const jwtMiddleWare: MiddlewareHandler = async (c, next) => {
  const authorization = c.req.header('Authorization');

  if (!authorization?.startsWith('Bearer ')) {
    return c.json(
      {
        message: 'Unauthorized'
      },
      401
    );
  }

  // 在这里校验 token

  await next();
};
