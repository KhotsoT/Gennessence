import crypto from 'crypto';

export function generatePayfastSignature(params: Record<string, string>, passphrase = ''): string {
  // Sort params alphabetically, build query string
  const paramString = Object.keys(params)
    .sort()
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
  const fullString = passphrase ? `${paramString}&passphrase=${encodeURIComponent(passphrase)}` : paramString;
  return crypto.createHash('md5').update(fullString).digest('hex');
} 