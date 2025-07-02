// // src/utils/tokenUtils.ts

// export const isTokenExpired = (token: string): boolean => {
//   try {
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     return payload.exp * 1000 < Date.now();
//   } catch {
//     return true;
//   }
// };

// export const getTokenExpiration = (token: string): Date | null => {
//   try {
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     return new Date(payload.exp * 1000);
//   } catch {
//     return null;
//   }
// };

// export const getUserFromToken = (token: string): any | null => {
//   try {
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     return payload.user;
//   } catch {
//     return null;
//   }
// };