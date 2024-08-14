import { bootstrapApplication } from '@angular/platform-browser';
import { PLATFORM_ID, inject } from '@angular/core';
import { AppComponent } from './app/app.component';
import { NgxIndexedDBService, DBConfig } from 'ngx-indexed-db';
import { FormComponent } from './app/components/form/form.component';
import { VideosComponent } from './app/components/videos/videos.component';

const dbConfig = {
  myDBConfig: {
    name: 'VideoDB',
    version: 1,
    objectStoresMeta: [
      {
        store: 'videos',
        storeConfig: { keyPath: 'id', autoIncrement: true },
        storeSchema: [
          { name: 'title', keypath: 'title', options: { unique: false } },
          {
            name: 'description',
            keypath: 'description',
            options: { unique: false },
          },
          { name: 'likes', keypath: 'likes', options: { unique: false } },
        ],
      },
    ],
  },
};

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: NgxIndexedDBService,
      useFactory: () => {
        const platformId = inject(PLATFORM_ID);
        // Adjust based on library version
        return new NgxIndexedDBService(dbConfig, platformId);
      },
    },
    FormComponent,
    VideosComponent,
  ],
}).catch((err) => console.error(err));
