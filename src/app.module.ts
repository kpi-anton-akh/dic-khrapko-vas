import { Module } from '@nestjs/common';
import { FilmsModule } from './modules/films';
import { DatabaseModule } from './systems/database';
import { AppConfigModule } from './config';

@Module({
  imports: [AppConfigModule, DatabaseModule, FilmsModule],
})
export class AppModule {}
