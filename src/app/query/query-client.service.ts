import { Injectable, inject } from '@angular/core';
import { QUERY_CLIENT } from './context';
import { QueryClient, QueryKey, QueryObserver, QueryObserverOptions, notifyManager } from '@tanstack/query-core';

@Injectable()
export class BaseQueryService {
  private readonly client = inject(QUERY_CLIENT);
}

export function createBaseQuery<
  TQQueryFnData,
  TError,
  TData,
  TQueryData,
  TQuerKey extends QueryKey
>(options: {}, Observer: typeof QueryObserver, queryClient?: QueryClient) {
    const client = queryClient ?? inject(QUERY_CLIENT);

    const observer = new Observer(client, {} as QueryObserverOptions);

    // observer.subscribe(notifyManager.batchCalls())
}
