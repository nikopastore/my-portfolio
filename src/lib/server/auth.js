// Import necessary modules
// Commented out database-related imports since we're not using the database
// import { eq } from 'drizzle-orm';
// import * as table from '$lib/server/db/schema';

// If you're still using these for encoding, keep them; otherwise, you can remove them
// import { sha256 } from '@oslojs/crypto/sha2';
// import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';

import crypto from 'crypto';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'auth-session';

/** @returns {string} */
function generateSessionToken() {
  const bytes = crypto.randomBytes(20);
  const token = bytes.toString('base64');
  return token;
}

/** @param {string} userId */
export async function createSession(userId) {
  const token = generateSessionToken();
  const sessionId = crypto.createHash('sha256').update(token).digest('hex');
  const session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + DAY_IN_MS * 30),
  };
  return session;
}

/**
 * @param {string} sessionId
 * @returns {Promise<void>}
 */
export async function invalidateSession(sessionId) {
}

/** @param {string} sessionId */
export async function validateSession(sessionId) {
  return { session: null, user: null };
}