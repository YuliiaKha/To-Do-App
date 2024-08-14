import { Routes } from '@angular/router';
import { VideosComponent } from './components/videos/videos.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

export const routes: Routes = [
  { path: '', component: VideosComponent, pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
