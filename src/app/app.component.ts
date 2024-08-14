import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormComponent } from './components/form/form.component';
import { VideosComponent } from './components/videos/videos.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormComponent, VideosComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}
