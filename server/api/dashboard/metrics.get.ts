// server/api/dashboard/metrics.get.ts
import { defineEventHandler, createError } from "h3";
import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "~/types/supabase";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event);

  // 1) Total de animales
  const { count: totalAnimals, error: errA } = await client
    .from("animals")
    .select("id_animal", { head: true, count: "exact" });
  if (errA) throw createError({ statusCode: 500, message: errA.message });

  // 2) Incremento de peso (%)
  const { data: pesos, error: errP } = await client
    .from("animals")
    .select("peso_inicial, peso_actual");
  if (errP) throw createError({ statusCode: 500, message: errP.message });
  let sumInicial = 0, sumActual = 0;
  pesos?.forEach((a) => {
    sumInicial += a.peso_inicial;
    sumActual  += a.peso_actual;
  });
  const weightIncreasePercent =
    sumInicial > 0
      ? Number(((sumActual - sumInicial) / sumInicial * 100).toFixed(2))
      : 0;

  // 3) Total de insumos
  const { count: totalInsumos, error: errI } = await client
    .from("inventario")
    .select("id_inventario", { head: true, count: "exact" });
  if (errI) throw createError({ statusCode: 500, message: errI.message });

  // 4) Stock bajo (umbral = 10 unidades)
  const LOW_THRESHOLD = 10;
  const { count: lowStock, error: errL } = await client
    .from("inventario")
    .select("id_inventario", { head: true, count: "exact" })
    .lte("cantidad", LOW_THRESHOLD);
  if (errL) throw createError({ statusCode: 500, message: errL.message });

  // 5) Gastos → suma de TODOS los precios de inventario
  const { data: invItems, error: errG } = await client
    .from("inventario")
    .select("precio");
  if (errG) throw createError({ statusCode: 500, message: errG.message });
  const totalExpenses = invItems?.reduce(
    (acc, item) => acc + (item.precio ?? 0),
    0
  ) ?? 0;

  return {
    totalAnimals,
    weightIncreasePercent,
    totalInsumos,
    lowStock,
    totalExpenses,
  };
});
