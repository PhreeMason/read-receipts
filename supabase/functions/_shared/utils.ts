import { verifyToken } from 'npm:@clerk/backend';

export function generateUrl(query: string) {
    return `https://www.goodreads.com/search?q=${encodeURIComponent(query)}`;
}

export const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'

export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

// Consolidated logging utility
export class Logger {
    private logs: Array<{ type: string; message: string; timestamp: number }> = [];

    log(...args: unknown[]): void {
        const message = args.map(String).join(' ');
        this.logs.push({ type: 'log', message, timestamp: Date.now() });
        console.log(...args);
    }

    error(...args: unknown[]): void {
        const message = args.map(String).join(' ');
        this.logs.push({ type: 'error', message, timestamp: Date.now() });
        console.error(...args);
    }

    getLogs(): Array<{ type: string; message: string; timestamp: number }> {
        return this.logs;
    }
}

// Authentication utility with better error handling
export async function authenticateUser(req: Request): Promise<string | null> {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return null;
    }

    try {
        const clerkSecretKey = Deno.env.get('CLERK_SECRET_KEY');
        if (!clerkSecretKey) {
            throw new Error('CLERK_SECRET_KEY not configured');
        }

        const token = authHeader.replace('Bearer ', '');
        const verifiedToken = await verifyToken(token, { secretKey: clerkSecretKey });

        return verifiedToken?.sub || null;
    } catch (error) {
        console.error('Authentication failed:', error);
        return null;
    }
}