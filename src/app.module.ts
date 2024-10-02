import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiariosModule } from './diarios/diarios.module';
import { AlmacenamientoService } from './almacenamiento/almacenamiento.service';

@Module({
  imports: [DiariosModule],
  controllers: [AppController],
  providers: [AppService, AlmacenamientoService],
})
export class AppModule {}
