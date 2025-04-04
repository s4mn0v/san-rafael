// ~/types/my-types.d.ts
declare global {
  interface Profile {
    id: string;
    email: string;
    role: enumum;
  }
  interface Database {
    public: {
      Tables: {
        profiles: {
          Row: Profile;
          Insert: {
            id: string;
            email: string;
            role: enumum;
          };
          Update: Partial<{
            id: string;
            email: string;
            role: enumum;
          }>;
        };
      };
    };
  }
}

export {};
