/**
 * Password hashing and verification utilities using PBKDF2 with SHA-256
 * Browser-native Web Crypto API - no external dependencies
 */

// PBKDF2 configuration
const SALT_LENGTH = 16; // 16 bytes = 128 bits
const ITERATIONS = 100000; // OWASP recommendation
const KEY_LENGTH = 32; // 32 bytes = 256 bits for SHA-256

/**
 * Generate a cryptographic random salt
 */
function generateSalt(): string {
  const saltBuffer = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  // Convert to hex string for storage
  return Array.from(saltBuffer)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Hash a password using PBKDF2 with SHA-256
 * @param password - The plaintext password to hash
 * @returns Object containing hex-encoded hash and salt
 */
export async function hashPassword(password: string): Promise<{
  hash: string;
  salt: string;
}> {
  const salt = generateSalt();
  const saltBuffer = new Uint8Array(
    salt.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
  );

  const passwordBuffer = new TextEncoder().encode(password);

  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    await crypto.subtle.importKey("raw", passwordBuffer, "PBKDF2", false, [
      "deriveBits",
    ]),
    KEY_LENGTH * 8, // Convert bytes to bits
  );

  const hashHex = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return {
    hash: hashHex,
    salt: salt,
  };
}

/**
 * Verify a password against a stored hash using constant-time comparison
 * @param password - The plaintext password to verify
 * @param storedHash - The previously stored hash
 * @param storedSalt - The previously stored salt
 * @returns true if password matches, false otherwise
 */
export async function verifyPassword(
  password: string,
  storedHash: string,
  storedSalt: string,
): Promise<boolean> {
  try {
    const saltBuffer = new Uint8Array(
      storedSalt.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
    );

    const passwordBuffer = new TextEncoder().encode(password);

    const computedHash = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: saltBuffer,
        iterations: ITERATIONS,
        hash: "SHA-256",
      },
      await crypto.subtle.importKey("raw", passwordBuffer, "PBKDF2", false, [
        "deriveBits",
      ]),
      KEY_LENGTH * 8,
    );

    const computedHashHex = Array.from(new Uint8Array(computedHash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Constant-time comparison to prevent timing attacks
    return constantTimeEqual(computedHashHex, storedHash);
  } catch (error) {
    console.error("Password verification failed", error);
    return false;
  }
}

/**
 * Constant-time string comparison to prevent timing attacks
 * @param a - First string to compare
 * @param b - Second string to compare
 * @returns true if strings are equal, false otherwise
 */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}
