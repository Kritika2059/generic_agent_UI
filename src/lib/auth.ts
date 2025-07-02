// src/lib/auth.ts

const ADMIN_EMAIL = "chadgigaa404@gmail.com";

export function isAdmin(email: string): boolean {
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
