import {
  inject,
  DestroyRef,
  Injector,
  signal,
  computed,
  effect,
} from '@angular/core';
import {
  DefaultError,
  QueryKey,
  QueryObserverOptions,
  QueryObserver,
} from '@tanstack/query-core';
import { injectQueryClient } from './context';

export type CreateQueryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = Omit<
  QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>,
  'queryKey'
> & {
  queryKey: () => TQueryKey;
};

export function createQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  options: CreateQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >
) {
  const client = injectQueryClient();
  const destroyRef = inject(DestroyRef);
  const injector = inject(Injector);

  const key = computed(options.queryKey);

  const actualOptions = computed(() => {
    return {
      ...options,
      queryKey: key(),
    };
  });

  const observer = new QueryObserver(client, {
    ...options,
    queryKey: key(),
  });
  const res = signal(
    observer.getOptimisticResult(client.defaultQueryOptions(actualOptions()))
  );

  effect(() => {
    console.log(actualOptions());
    observer.setOptions(actualOptions())
  }, { allowSignalWrites: true })

//   effect(() => {
//     observer.setOptions(actualOptions());
//   });

  let unsubscribe = observer.subscribe(() => {
    res.set(observer.trackResult(observer.getCurrentResult()));
  });

  destroyRef.onDestroy(() => {
    console.log('destroy query');
    unsubscribe();
  });

  return res;
}
