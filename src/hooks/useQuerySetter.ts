// hooks/useQuerySetter.ts
'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

type ParamValue = string | number | boolean | null | undefined;

type Options = {
  mode?: 'replace' | 'push';
  scroll?: boolean;
  keepEmpty?: boolean; // NEW: keep key when value === ""
  refreshOnSameUrl?: boolean; // NEW: force re-render if URL doesn't change
};

export function useQuerySetter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const apply = useCallback(
    (
      updates: Record<string, ParamValue>,
      {
        mode = 'replace',
        scroll,
        keepEmpty = false,
        refreshOnSameUrl = false,
      }: Options = {},
    ) => {
      const before = `${pathname}?${searchParams.toString()}`;
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          params.delete(key);
        } else if (value === '' && !keepEmpty) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      const qs = params.toString();
      const url = qs ? `${pathname}?${qs}` : pathname;

      if (url === before) {
        if (refreshOnSameUrl) router.refresh();
        return;
      }

      if (mode === 'push') {
        router.push(url, { scroll });
      } else {
        router.replace(url, { scroll });
      }
    },
    [router, pathname, searchParams],
  );

  const setQueryParam = useCallback(
    (key: string, value: ParamValue, opts?: Options) => apply({ [key]: value }, opts),
    [apply],
  );

  const setMultipleQueryParams = useCallback(
    (updates: Record<string, ParamValue>, opts?: Options) => apply(updates, opts),
    [apply],
  );

  return { setQueryParam, setMultipleQueryParams };
}
