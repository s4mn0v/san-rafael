// ~/types/types.d.ts
declare global {
  interface CustomError extends Error {
    data?: {
      message: string;
    };
  }

  interface Profile {
    id: string;
    email: string;
    role: string;
  }
  interface UserProfile {
    role: string;
  }
  // Drop down in column actions table
  type DropdownMenuItem = {
    label: string;
    icon?: string;
    class?: string;
    click?: () => void;
  };
}

export {};
