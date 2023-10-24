import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  inject
} from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { createQuery } from '../query/createQuery';

export type Post = {
  body: string;
  id: number;
  title: string;
  userId: number;
};



@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './posts.component.html',
})
export class PostsComponent {
  http = inject(HttpClient);

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

