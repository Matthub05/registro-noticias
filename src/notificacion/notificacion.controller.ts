import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotificacionService } from './notificacion.service';

@ApiTags('Notificaciones')
@Controller('notificacion')
export class NotificacionController {
  constructor(private readonly notificacionService: NotificacionService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las notificaciones' })
  getNotifications() {
    return this.notificacionService.getNotifications();
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva notificación' })
  @ApiResponse({
    status: 201,
    description: 'La notificación ha sido creada',
  })
  createNotification(@Body('message') message: string) {
    return this.notificacionService.sendNotification(message);
  }

  @Delete()
  @ApiOperation({ summary: 'Eliminar todas las notificaciones' })
  clearNotifications() {
    this.notificacionService.clearNotifications();
    return { message: 'Las notificaciones fueron eliminadas' };
  }
}
