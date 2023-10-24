import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Type, assertInInjectionContext, inject } from '@angular/core';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { createQuery } from '../query/createQuery';

export type Post = {
  body: string;
  id: number;
  title: string;
  userId: number;
};

const hihi = sample(() => {
  const cli = inject(HttpClient);

  return cli.get(`https://jsonplaceholder.typicode.com/posts/${1}`)
});

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './posts.component.html',
})
export class PostsComponent {
  http = inject(HttpClient);

  sample$ = hihi()

  posts = createQuery({
    queryKey: () => ['posts'],
    queryFn: () => {
      const req = this.http.get<Array<Post>>(
        `https://jsonplaceholder.typicode.com/posts`
      );

      return firstValueFrom(req);
    },
  });
}

function sample<R>(fn: () => R) {
  // assertInInjectionContext(fn);

  function invoker() {
    const res = fn();

    return res;
  }

  invoker.preload = () => {}

  return invoker;
}
