import { hash, verify } from '@node-rs/argon2';

/**
 * Hashes a plain-text password using Argon2id.
 * @param {string} password - The plain-text password to hash.
 * @returns {Promise<string>} - A hashed version of the password.
 */
export async function hashPassword(password) {
  const hashingConfig = {
    memoryCost: 65536, // 64MB in KiB (64 * 1024)
    timeCost: 3,       // Number of iterations
    parallelism: 4,    // Degree of parallelism
    hashLength: 32     // Hash length in bytes
  };
  
  return await hash(password, hashingConfig);
}

/**
 * Verifies a plain-text password against a hashed password.
 * @param {string} inputPassword - The plain-text password to verify.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} - True if the passwords match, false otherwise.
 */
export async function verifyPassword(inputPassword, hashedPassword) {
  try {
    return await verify(hashedPassword, inputPassword);
  } catch {
    return false;
  }
}

// Example usage to hash "cafe2024"
// hashPassword("cafe2024").then(console.log).catch(console.error);