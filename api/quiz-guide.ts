import { createQuizGuideMiddleware } from '../vite/geminiGuideApi';
import type { IncomingMessage, ServerResponse } from 'node:http';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: IncomingMessage, res: ServerResponse) {
  const middleware = createQuizGuideMiddleware(process.env.GEMINI_API_KEY);
  
  return new Promise<void>((resolve) => {
    middleware(req, res, () => {
      res.statusCode = 404;
      res.end('Not Found');
      resolve();
    });
  });
}
