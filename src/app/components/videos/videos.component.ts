import { Component } from '@angular/core';
import { VideoService } from '../../services/video.service';
import { Video } from '../../interfaces/video';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-videos',
  standalone: true,
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css'],
  imports: [CommonModule],
})
export class VideosComponent {
  videos: Video[] = [];

  constructor(private videoService: VideoService) {}

  ngOnInit(): void {
    this.loadVideos();
  }

  loadVideos() {
    this.videoService
      .getVideos()
      .then((videos) => {
        console.log('Videos updated:', videos); // Debugging log
        this.videos = videos;
      })
      .catch((error) => console.error('Error loading videos:', error));
  }

  likeVideo(video: Video): void {
    const newLikes = video.likes + 1;
    this.videoService
      .updateVideo({ ...video, likes: newLikes })
      .then(() => {
        console.log('Video liked:', video); // Debugging log
        this.loadVideos(); // Refresh the video list
      })
      .catch((error) => console.error('Error liking video:', error));
  }

  dislikeVideo(video: Video): void {
    const newLikes = Math.max(video.likes - 1, 0);
    this.videoService
      .updateVideo({ ...video, likes: newLikes })
      .then(() => {
        console.log('Video disliked:', video); // Debugging log
        this.loadVideos(); // Refresh the video list
      })
      .catch((error) => console.error('Error disliking video:', error));
  }

  deleteVideo(video: Video): void {
    this.videoService
      .deleteVideo(video)
      .then(() => {
        console.log('Video deleted:', video); // Debugging log
        this.loadVideos(); // Refresh the video list
      })
      .catch((error) => console.error('Error deleting video:', error));
  }
}
