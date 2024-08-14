import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Video } from '../interfaces/video';
import { BehaviorSubject, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private db!: IDBDatabase;
  private videosSubject = new BehaviorSubject<Video[]>([]);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.openDatabase().then(() => {
        this.loadVideos(); 
      });
    }
  }

  private openDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof indexedDB !== 'undefined') {
        const request = indexedDB.open('VideoDB', 1);

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
          const db = (event.target as IDBOpenDBRequest).result;
          db.createObjectStore('videos', {
            keyPath: 'id',
            autoIncrement: true,
          });
        };

        request.onsuccess = (event: Event) => {
          this.db = (event.target as IDBOpenDBRequest).result;
          console.log('Database opened successfully');
          resolve();
        };

        request.onerror = (event: Event) => {
          console.error(
            'Error opening database:',
            (event.target as IDBOpenDBRequest).error
          );
          reject((event.target as IDBOpenDBRequest).error);
        };
      } else {
        console.error('IndexedDB is not available in this environment.');
        reject(new Error('IndexedDB is not available'));
      }
    });
  }

  private ensureDbInitialized(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        resolve(this.db);
      } else {
        const interval = setInterval(() => {
          if (this.db) {
            clearInterval(interval);
            resolve(this.db);
          }
        }, 100);
        setTimeout(() => {
          clearInterval(interval);
          reject(new Error('Database initialization timeout'));
        }, 5000);
      }
    });
  }

  getVideos(): Promise<Video[]> {
    return this.ensureDbInitialized().then(() => {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['videos'], 'readonly');
        const store = transaction.objectStore('videos');
        const request = store.getAll();

        request.onsuccess = (event: Event) => {
          resolve((event.target as IDBRequest<Video[]>).result);
        };

        request.onerror = (event: Event) => {
          reject((event.target as IDBRequest).error);
        };
      });
    });
  }

  addVideo(video: Video): Promise<void> {
    return this.ensureDbInitialized().then(() => {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['videos'], 'readwrite');
        const store = transaction.objectStore('videos');
        const request = store.add(video);

        request.onsuccess = () => {
          this.loadVideos();
          resolve();
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    });
  }

  updateVideo(video: Video): Promise<void> {
    if (video.id === undefined) {
      return Promise.reject('Video ID is undefined');
    }

    return this.ensureDbInitialized().then(() => {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['videos'], 'readwrite');
        const store = transaction.objectStore('videos');
        const request = store.put(video);

        request.onsuccess = () => {
          this.loadVideos();
          resolve();
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    });
  }

  deleteVideo(video: Video): Promise<void> {
    if (video.id === undefined || video.id === null) {
      return Promise.reject('Video ID is undefined or null');
    }

    return this.ensureDbInitialized().then(() => {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['videos'], 'readwrite');
        const store = transaction.objectStore('videos');
        const request = store.delete(video.id as IDBValidKey);

        request.onsuccess = () => {
          this.loadVideos();
          resolve();
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    });
  }

  private loadVideos() {
    this.getVideos().then((videos) => this.videosSubject.next(videos));
  }
}
