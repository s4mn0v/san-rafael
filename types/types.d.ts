// ~/types/types.d.ts
declare global {
  interface Profile {
    id: string;
    email: string;
    role: string;
  }
  interface UserProfile {
    role: string;
  }
}

export {};
