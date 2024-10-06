import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { Diario } from 'src/models/diario.entity';
import { Notification } from 'src/models/notificacion.entity';

@Injectable()
export class AlmacenamientoService {
  private static instancia: AlmacenamientoService;
  private diarios: Diario[] = [];
  private readonly ARCHIVO_DATOS = 'data/diarios.json';
  private notificaciones: Notification[] = [];
  private readonly ARCHIVO_NOTIFICACIONES = 'data/notificaciones.json';

  constructor() {
    this.cargarDiarios();
    this.cargarNotificaciones();
  }

  public static obtenerInstancia(): AlmacenamientoService {
    if (!AlmacenamientoService.instancia) {
      AlmacenamientoService.instancia = new AlmacenamientoService();
    }
    return AlmacenamientoService.instancia;
  }

  private cargarDiarios(): void {
    try {
      const datos = fs.readFileSync(this.ARCHIVO_DATOS, 'utf-8');
      this.diarios = JSON.parse(datos);
    } catch (error) {
      console.log(
        'No se encontró archivo de datos. Se iniciará con una lista vacía.',
      );
      this.diarios = [];
    }
  }

  private cargarNotificaciones(): void {
    try {
      const datos = fs.readFileSync(this.ARCHIVO_NOTIFICACIONES, 'utf-8');
      this.notificaciones = JSON.parse(datos);
    } catch (error) {
      console.log(
        'No se encontró archivo de notificaciones. Se iniciará con una lista vacía.',
      );
      this.notificaciones = [];
    }
  }

  public guardarDiarios(): void {
    fs.writeFileSync(this.ARCHIVO_DATOS, JSON.stringify(this.diarios, null, 2));
  }

  public guardarNotificaciones(): void {
    fs.writeFileSync(
      this.ARCHIVO_NOTIFICACIONES,
      JSON.stringify(this.notificaciones, null, 2),
    );
  }

  public getDiarios(): Diario[] {
    return this.diarios;
  }

  public getNotificaciones(): Notification[] {
    return this.notificaciones;
  }
}
