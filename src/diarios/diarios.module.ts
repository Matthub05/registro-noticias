import { Module } from '@nestjs/common';
import { DiariosService } from './diarios.service';
import { DiariosController } from './diarios.controller';
import { AlmacenamientoService } from '../services/almacenamiento.service';
import { NotificacionService } from 'src/notificacion/notificacion.service';

@Module({
  controllers: [DiariosController],
  providers: [DiariosService, AlmacenamientoService, NotificacionService],
})
export class DiariosModule {}
