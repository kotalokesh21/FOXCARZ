import { Request, Response, NextFunction } from 'express';

declare module 'express-session' {
  interface SessionData {
    userId: string;
    isAdmin: boolean;
  }
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userId && req.session.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized' });
  }
};