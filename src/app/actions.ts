"use server";

import { revalidatePath } from "next/cache";

/**
 * Purgará el caché de Next.js en la ruta raíz ('/') de forma layout-wide,
 * forzando a los componentes con 'force-dynamic' o llamados de Supabase a re-fetchear
 * Data en el servidor en el siguiente refresh.
 */
export async function revalidateAppCache() {
    revalidatePath("/", "layout");
}
