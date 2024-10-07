import { Injectable } from '@nestjs/common';
import { Notification } from 'src/models/notificacion.entity';
import { AlmacenamientoService } from 'src/services/almacenamiento.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificacionService {
  private notifications: Notification[] = [];

  constructor(private readonly almacenamiento: AlmacenamientoService) {
    this.notifications = this.almacenamiento.getNotificaciones();
  }

  async sendNotification(
    createNotification: CreateNotificationDto,
  ): Promise<void> {
    const { idDiario, message } = createNotification;
    const notification: Notification = {
      idDiario,
      message,
      timestamp: new Date(),
    };
    this.notifications.push(notification);
    this.almacenamiento.guardarNotificaciones();
  }

  getNotifications(): Notification[] {
    return this.notifications;
  }

  getNotificationsByDiario(idDiario: number): Notification[] {
    return this.notifications.filter(
      (notification) => notification.idDiario === idDiario,
    );
  }

  clearNotifications(): void {
    this.notifications = [];
    this.almacenamiento.guardarNotificaciones();
  }
}
