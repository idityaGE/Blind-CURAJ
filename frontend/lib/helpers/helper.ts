import { SignJWT, jwtVerify } from 'jose';
import { hash, compare } from 'bcryptjs';

// Create a TextEncoder instance
const encoder = new TextEncoder();

// JWT Token
export const generateToken = async (payload: any) => {
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
}

export const verifyToken = async (token: string) => {
  try {
    const secret = encoder.encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
}

// Hashing and Verifying PIN
export const hashPin = async (pin: string) => {
  try {
    const hashedPin = await hash(pin, 10);
    return hashedPin;
  } catch (error) {
    console.error('Error hashing pin:', error);
    throw error;
  }
}

export const verifyPin = async (pin: string, hashedPin: string) => {
  try {
    const isValid = await compare(pin, hashedPin);
    return isValid;
  } catch (error) {
    console.error('Error verifying pin:', error);
    throw error;
  }
}

export const generateVerifyToken = async () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}