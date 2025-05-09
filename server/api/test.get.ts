// server/api/animal/test.get.ts
export default defineEventHandler(async (event) => {
  console.log("--- HITTING /api/animal/test.get.ts ---");
  return { message: "Test endpoint for animals OK" };
});
