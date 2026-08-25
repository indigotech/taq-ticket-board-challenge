/** Dummy function to generate random data for seeds. */
export function generateRandomString(length = 10): string {
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ';
  return Array.from({ length }, () => ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length))).join('');
}
