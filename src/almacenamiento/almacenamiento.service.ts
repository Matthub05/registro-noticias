import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { Diario } from 'src/diarios/entities/diario.entity';

@Injectable()
export class AlmacenamientoService {

  private static instancia: AlmacenamientoService;
  private diarios: Diario[] = [];
  private readonly ARCHIVO_DATOS = 'data/diarios.json';

  constructor() {
      this.cargarDatos();
  }

  public static obtenerInstancia(): AlmacenamientoService {
      if (!AlmacenamientoService.instancia) {
          AlmacenamientoService.instancia = new AlmacenamientoService();
      }
      return AlmacenamientoService.instancia;
  }

  private cargarDatos(): void {
      try {
          const datos = fs.readFileSync(this.ARCHIVO_DATOS, 'utf-8');
          this.diarios = JSON.parse(datos);
      } catch (error) {
          console.log("No se encontró archivo de datos. Se iniciará con una lista vacía.");
          this.diarios = [];
      }
  }

  public guardarDatos(): void {
      fs.writeFileSync(this.ARCHIVO_DATOS, JSON.stringify(this.diarios, null, 2));
  }

  public getDiarios(): Diario[] {
      return this.diarios;
  }

}
