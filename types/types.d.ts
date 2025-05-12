// ~/types/types.d.ts
declare global {
  interface CustomError extends Error {
    data?: {
      message: string;
    };
  }

  interface Profile {
    id: string;
    name: string;
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

  type TreeNode = {
    id: string;
    raza: string;
    tipo_animal: string;
    madre?: TreeNode;
    padre?: TreeNode;
  };

}

export {};
