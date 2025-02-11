export async function encrypt(text: string, publicKey: string): Promise<string> {
  // Convert PEM public key to format needed by SubtleCrypto
  const pemHeader = '-----BEGIN PUBLIC KEY-----';
  const pemFooter = '-----END PUBLIC KEY-----';
  const pemContents = publicKey.substring(
    pemHeader.length,
    publicKey.length - pemFooter.length
  );
  const binaryDer = window.atob(pemContents);
  const binaryArray = new Uint8Array(binaryDer.length);
  for (let i = 0; i < binaryDer.length; i++) {
    binaryArray[i] = binaryDer.charCodeAt(i);
  }

  // Import the public key
  const cryptoKey = await window.crypto.subtle.importKey(
    'spki',
    binaryArray,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    true,
    ['encrypt']
  );

  // Encrypt the data
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    cryptoKey,
    data
  );

  // Convert to base64 -- OUT OF DATE REPLACE THIS WITH THE NEW ENCRYPTION METHOD
  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}