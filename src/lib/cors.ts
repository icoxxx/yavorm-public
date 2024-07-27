import cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';

// Initializing the cors middleware
const runCors = cors({
  origin: 'http://localhost:3000', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
});

// Helper method to handle CORS
export default function withCors(handler: (req: NextApiRequest, res: NextApiResponse) => void) {
    return (req: NextApiRequest, res: NextApiResponse) => {
      // Applying the cors middleware to the request
      return runCors(req, res, () => handler(req, res));
    };
  }
