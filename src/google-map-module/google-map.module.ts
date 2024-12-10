import { Module, Global } from '@nestjs/common';
import { createClient } from '@google/maps';

@Global()
@Module({
  providers: [
    {
      provide: 'GOOGLE_MAPS_CLIENT',
      useValue: createClient({
        key: process.env.GOOGLE_MAPS_API_KEY,
        Promise: Promise
      }),
    },
  ],
  exports: ['GOOGLE_MAPS_CLIENT'],
})
export class GoogleMapModule {}