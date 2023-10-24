import {
  Component,
  DestroyRef,
  Injector,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import {
  DefaultError,
  QueryClient,
  QueryKey,
  QueryObserver,
  QueryObserverOptions,
} from '@tanstack/query-core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { injectQueryClient } from './query/context';
import { AngularQueryDevtools } from './query/devtools.component';

type Post = {
  body: string;
  id: number;
  title: string;
  userId: number;
};

// const client = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 5000
//     }
//   }
// });

function createQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  options: QueryObserverOptions<
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

  const observer = new QueryObserver(client, options);
  const res = signal(
    observer.getOptimisticResult(client.defaultQueryOptions(options))
  );

  let unsubscribe = observer.subscribe(() => {
    res.set(observer.trackResult(observer.getCurrentResult()));
  });

  destroyRef.onDestroy(() => {
    console.log('destroy query')
    unsubscribe();
  });

  return res;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, AngularQueryDevtools],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-query';

}
