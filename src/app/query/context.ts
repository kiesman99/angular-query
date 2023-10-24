import {
  DestroyRef,
  InjectionToken,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import { QueryClient, QueryClientConfig } from '@tanstack/query-core';
import { BaseQueryService } from './query-client.service';

export const QUERY_CLIENT = new InjectionToken<QueryClient>(
  'angular-query:query-client'
);

const defaultConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 5000,
    },
  },
};

export const provideAngularQuery = (config: {
  queryClientConfig?: QueryClientConfig;
}) => {
  return makeEnvironmentProviders([
    {
      provide: QUERY_CLIENT,
      useFactory: () => {
        const destroyRef = inject(DestroyRef);
        const queryConfig = config.queryClientConfig ?? defaultConfig;
        const client = new QueryClient(queryConfig);
        client.mount();
        destroyRef.onDestroy(() => client.unmount());
        return client;
      },
    },
    BaseQueryService,
  ]);
};

export const injectQueryClient = () => {
  const queryClient = inject(QUERY_CLIENT);

  if (!queryClient) {
    throw new Error(
      `No QueryClient was found. Please provide a QueryClient via 'provideQueryClient'`
    );
  }

  return queryClient;
};
