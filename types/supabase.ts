// types/supabase.ts
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: string;
          email: string;
        };
        Insert: {
          id: string;
          role: string;
          email: string;
        };
        Update: {
          role?: string;
          email?: string;
        };
      };
    };
  };
};
