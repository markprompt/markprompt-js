export const importKeyFromBase64 = async (base64Key: string) => {
  const rawKey = Uint8Array.from(atob(base64Key), (c) => c.charCodeAt(0));
  return await globalThis.crypto.subtle.importKey(
    'raw',
    rawKey,
    { name: 'AES-GCM' },
    true,
    ['encrypt', 'decrypt'],
  );
};

export const packEncrypted = (
  ciphertext: ArrayBuffer,
  iv: Uint8Array,
): string => {
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return btoa(String.fromCharCode(...combined));
};

export const unpackEncrypted = (
  data: string,
): { iv: Uint8Array; ciphertext: ArrayBuffer } => {
  const binary = atob(data);
  const bytes = new Uint8Array([...binary].map((c) => c.charCodeAt(0)));
  const iv = bytes.slice(0, 12);
  const ciphertext = bytes.slice(12).buffer;
  return { ciphertext, iv };
};

export const encrypt = async (plaintext: string, key: CryptoKey) => {
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await globalThis.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded,
  );
  return { iv, ciphertext };
};

export const decrypt = async (
  ciphertext: ArrayBuffer,
  key: CryptoKey,
  iv: Uint8Array,
) => {
  const decrypted = await globalThis.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext,
  );
  return new TextDecoder().decode(decrypted);
};
