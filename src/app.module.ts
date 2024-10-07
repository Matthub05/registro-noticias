import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DiariosModule } from './diarios/diarios.module';
import { NotificacionModule } from './notificacion/notificacion.module';

@Module({
  imports: [DiariosModule, NotificacionModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
