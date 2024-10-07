import { Request, Response, NextFunction } from 'express';

export function handleError(res: Response, error: unknown, message: string) {
    res.status(500).json({ message, error: error instanceof Error ? error.message : 'Internal server error' });
}