"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Gère les paramètres de filtre/tri du catalogue dans l'URL.
 * Toute modification de filtre réinitialise la pagination à la page 1.
 */
export function useCatalogueParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const get = useCallback(
    (key: string) => searchParams.get(key) ?? "",
    [searchParams],
  );

  const getList = useCallback(
    (key: string) => {
      const v = searchParams.get(key);
      return v ? v.split(",").filter(Boolean) : [];
    },
    [searchParams],
  );

  const commit = useCallback(
    (params: URLSearchParams) => {
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  /** Définit (ou supprime si vide) un paramètre simple. */
  const setParam = useCallback(
    (key: string, value: string | null, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      if (resetPage) params.delete("page");
      commit(params);
    },
    [searchParams, commit],
  );

  /** Ajoute/retire une valeur d'un paramètre liste (ex: catégories). */
  const toggleInList = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = (params.get(key)?.split(",").filter(Boolean) ?? []) as string[];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      if (next.length) params.set(key, next.join(","));
      else params.delete(key);
      params.delete("page");
      commit(params);
    },
    [searchParams, commit],
  );

  /** Réinitialise tous les filtres. */
  const reset = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  return { get, getList, setParam, toggleInList, reset, searchParams };
}
