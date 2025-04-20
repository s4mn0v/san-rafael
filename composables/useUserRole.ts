export const useUserRole = () => {
  return useState<string | null>("userRole", () => null);
};
