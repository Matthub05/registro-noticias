import { Module } from '@nestjs/common';
import { NotificacionService } from './notificacion.service';
import { NotificacionController } from './notificacion.controller';
import { AlmacenamientoService } from 'src/services/almacenamiento.service';

@Module({
  providers: [NotificacionService, AlmacenamientoService],
  controllers: [NotificacionController],
})
export class NotificacionModule {}
