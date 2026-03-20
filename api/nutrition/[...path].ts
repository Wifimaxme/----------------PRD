import { createNutritionApiMiddleware } from '../../vite/geminiNutritionApi';
import type { IncomingMessage, ServerResponse } from 'node:http';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: IncomingMessage, res: ServerResponse) {
  const middleware = createNutritionApiMiddleware(process.env.GEMINI_API_KEY);
  
  return new Promise<void>((resolve) => {
    middleware(req, res, () => {
      res.statusCode = 404;
      res.end('Not Found');
      resolve();
    });
  });
}
