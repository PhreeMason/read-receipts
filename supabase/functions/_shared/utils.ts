export function generateUrl(query: string) {
    return `https://www.goodreads.com/search?q=${encodeURIComponent(query)}`;
}

export const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'

export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

/**
 * Verifies a Clerk token and returns user information.
 * @param {string} token - The Clerk JWT token to verify.
 * @returns {Promise<{ role: string, sid: string, sub: string } | null>} - Returns user info if valid, otherwise null.
 */

async function verifyClerkToken(token) {
    try {
        const clerkSecretKey = Deno.env.get('CLERK_SECRET_KEY');
        if (!clerkSecretKey) {
            throw new Error('CLERK_SECRET_KEY not found in environment variables');
        }
        const { role, sid, sub } = await verifyToken(token, {
            secretKey: clerkSecretKey
        });
        if (!sub) {
            return null;
        }
        if (role !== AUTHENTICATED) {
            console.warn(`User role is not authenticated: ${role}`);
            return null;
        }
        return {
            role,
            sid,
            sub
        };
    } catch (error) {
        console.error('Error verifying Clerk token:', error);
        return null;
    }
}

export async function authenticateRequest(req) {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Authorization header required');
    }

    const token = authHeader.replace('Bearer ', '');
    const clerkUser = await verifyClerkToken(token);
    if (!clerkUser) {
        throw new Error('Invalid or expired token');
    }

    return clerkUser.sub;
}
