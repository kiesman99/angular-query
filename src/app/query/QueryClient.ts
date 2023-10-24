import { QueryClientConfig, QueryClient as QueryCoreClient } from '@tanstack/query-core';

export class QueryClient extends QueryCoreClient {
    constructor(config: QueryClientConfig = {}) {
        super(config);
    }
}