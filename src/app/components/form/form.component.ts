import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VideoService } from '../../services/video.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  standalone: true,
  imports: [FormsModule, NgIf],
})

export class FormComponent {
  newVideo = {
    title: '',
    description: '',
    likes: 0,
  };

  constructor(private videoService: VideoService) {}

  addVideo() {
    if (this.newVideo.title && this.newVideo.description) {
      this.videoService.addVideo(this.newVideo).then(() => {
        this.newVideo = { title: '', description: '', likes: 0 };
      }).catch((error) => {
        console.error('Error adding video:', error);
      });
    }
  }
}
