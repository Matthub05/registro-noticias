import { Module } from '@nestjs/common';
import { DiariosService } from './diarios.service';
import { DiariosController } from './diarios.controller';
import { AlmacenamientoService } from 'src/almacenamiento/almacenamiento.service';

@Module({
  controllers: [DiariosController],
  providers: [DiariosService, AlmacenamientoService],
})
export class DiariosModule {}
