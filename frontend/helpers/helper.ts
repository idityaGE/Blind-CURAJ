import { SignJWT, jwtVerify } from 'jose';

const encoder = new TextEncoder();
const alg = 'HS256';

export async function generateResetToken(userId: string): Promise<string> {
  const secret = encoder.encode(process.env.JWT_SECRET!);
  const jwt = await new SignJWT({ userId })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('30m')
    .sign(secret);

  return jwt;
}

export async function verifyResetToken(token: string): Promise<string> {
  try {
    const secret = encoder.encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload.userId as string;
  } catch (error) {
    throw new Error('Invalid or expired reset token');
  }
}

export const generateToken = async (payload: any): Promise<string> => {
  try {
    const secret = encoder.encode(process.env.JWT_SECRET!);
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .sign(secret);
    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
};

export const verifyToken = async (token: string): Promise<any> => {
  try {
    const secret = encoder.encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
};

// Edge-compatible PIN hashing using Web Crypto API
export const hashPin = async (pin: string): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch (error) {
    console.error('Error hashing pin:', error);
    throw error;
  }
};

export const verifyPin = async (pin: string, hashedPin: string): Promise<boolean> => {
  try {
    const newHash = await hashPin(pin);
    return newHash === hashedPin;
  } catch (error) {
    console.error('Error verifying pin:', error);
    throw error;
  }
};

export const generateVerifyToken = async (): Promise<string> => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};