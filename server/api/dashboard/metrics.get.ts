import { defineEventHandler } from "h3";
import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "~/types/supabase";
import { createError, getHeader } from "h3";

export default defineEventHandler(async (event) => {

  // --- INICIO: Comprobación de Acceso Directo ---
  // const secFetchSite = getHeader(event, 'sec-fetch-site')

  // if (secFetchSite === 'none') {
  //   console.warn(`Acceso directo bloqueado para la ruta ${event.path}. Sec-Fetch-Site: ${secFetchSite}`);
  //   throw createError({
  //     statusCode: 403, // Forbidden
  //     statusMessage: 'Forbidden',
  //     message: 'Direct access not allowed.'
  //   });
  // }
  // --- FIN: Comprobación de Acceso Directo ---

  const client = await serverSupabaseClient<Database>(event);

  // 1) Total de animales
  const { count: totalAnimals } = await client
    .from("animals")
    .select("id_animal", { head: true, count: "exact" });

  // 2) Incremento de peso (%): (sum(peso_actual)-sum(peso_inicial))/sum(peso_inicial)*100
  const { data: pesos } = await client
    .from("animals")
    .select("peso_inicial, peso_actual");
  let sumInicial = 0,
      sumActual = 0;
  pesos?.forEach((a) => {
    sumInicial += a.peso_inicial;
    sumActual  += a.peso_actual;
  });
  const weightIncreasePercent =
    sumInicial > 0
      ? Number(((sumActual - sumInicial) / sumInicial * 100).toFixed(2))
      : 0;

  // 3) Total de insumos
  const { count: totalInsumos } = await client
    .from("inventario")
    .select("id_inventario", { head: true, count: "exact" });

  // 4) Stock bajo (ejemplo umbral = 10 unidades)
  const LOW_THRESHOLD = 10;
  const { count: lowStock } = await client
    .from("inventario")
    .select("id_inventario", { head: true, count: "exact" })
    .lte("cantidad", LOW_THRESHOLD);

  // 5) Gastos últimos 30 días (ejemplo: sumamos el monto de todas las ventas como “gastos”)
  const hace30 = new Date();
  hace30.setDate(hace30.getDate() - 30);
  const fecha30 = hace30.toISOString().split("T")[0]; // YYYY-MM-DD
  const { data: ventas } = await client
    .from("ventas")
    .select("monto")
    .gte("fecha_venta", fecha30);
  let totalExpenses = 0;
  ventas?.forEach((v) => {
    totalExpenses += v.monto ?? 0;
  });  

  return {
    totalAnimals,
    weightIncreasePercent,
    totalInsumos,
    lowStock,
    totalExpenses,
  };
});
