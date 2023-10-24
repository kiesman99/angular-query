import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, map } from 'rxjs';
import { Post } from '../posts/posts.component';
import { createQuery } from '../query/createQuery';

@Component({
  standalone: true,
  imports: [],
  template: `
    <h1>ID: {{ id() }}</h1>

    <button (click)="inc()">INC</button>

    <p>Title: {{ post().data?.title }}</p>
  `,
})
export class PostComponent {
  id$ = inject(ActivatedRoute).params.pipe(map((p) => p['id']));
  //   id = toSignal(this.id$);

  id = signal(1);

  http = inject(HttpClient);

  post = createQuery({
    queryKey: () => ['posts', this.id()],
    queryFn: () => {
      const req = this.http.get<Post>(
        `https://jsonplaceholder.typicode.com/posts/${this.id()}`
      );

      return firstValueFrom(req);
    }
  });

  inc() {
    this.id.update(o => o + 1)
  }
}
