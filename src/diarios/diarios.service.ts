import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDiarioDto } from './dto/create-diario.dto';
import { UpdateDiarioDto } from './dto/update-diario.dto';
import { Diario } from './entities/diario.entity';
import { RegisterNewsDto } from './dto/register-news.dto';
import { News } from './entities/news.entity';
import { AlmacenamientoService } from './services/almacenamiento.service';
import { getAverage, getPercentage } from 'src/helpers/math-helper';

@Injectable()
export class DiariosService {

  private diarios: Diario[] = [];

  constructor(
    private readonly almacenamiento: AlmacenamientoService,
  ) {
    this.diarios = this.almacenamiento.getDiarios();
  }

  create(diario: CreateDiarioDto) {
    const { name, description } = diario;
    const idUltimoDiario = this.getUltimoDiario()?.id || 0;
    const id = idUltimoDiario + 1;
    const nuevoDiario: Diario = { id, name, description, news: [] };
    this.diarios.push(nuevoDiario);
    this.almacenamiento.guardarDatos();
    return nuevoDiario;
  }

  findAll() {
    return this.diarios;
  }

  findOne(id: number) {
    const diario = this.diarios.find(d => d.id === id);
    if (!diario) throw new NotFoundException("Diario no encontrado");
    return diario;
  }

  update(id: number, updateDiarioDto: UpdateDiarioDto) {
    const diario = this.findOne(id);
    if (!diario) throw new NotFoundException("Diario no encontrado");
    const { name, description } = updateDiarioDto;
    diario.name = name;
    diario.description = description;
    this.almacenamiento.guardarDatos();
    return diario;
  }

  remove(id: number) {
    const index = this.diarios.findIndex(d => d.id === id);
    if (index === -1) throw new NotFoundException("Diario no encontrado");

    this.diarios.splice(index, 1);

    this.almacenamiento.guardarDatos();
    return { message: "Diario eliminado exitosamente" };
  }

  registerNews(registerNews: RegisterNewsDto) {
    const { idDiario, date, amount } = registerNews;
    const diario = this.findOne(idDiario);
    if (!diario) throw new NotFoundException("Diario no encontrado");
  
    const currentDate = new Date();
    const newsDate = new Date(date);
    if (newsDate < currentDate) {
      throw new ConflictException("La fecha no puede ser del pasado");
    }
    
    for (const news of diario.news) {
      if (news.date == newsDate) {
        news.amount += amount;
        this.almacenamiento.guardarDatos();
        return diario;
      }
    }

    const news: News = { date, amount };
    if (!this.validarEstadisticas(news, diario.news)) {
      throw new ConflictException("La noticia no cumple con las estadísticas");
    }

    diario.news.push(news);
    this.almacenamiento.guardarDatos();
    return diario;
  }

  private validarEstadisticas(nuevaNoticia: News, noticias: News[]): boolean {
    const cantidades = noticias.map(n => n.amount);
    
    // Si hay menos de 3 noticias, no se valida
    if (cantidades.length < 3) {
      return true;
    }

    // Calcular el promedio y validar si la nueva noticia es mayor al 80% del promedio
    const promedio = getAverage(cantidades);
    if (getPercentage(80, promedio) <= nuevaNoticia.amount) {
      return true;
    }
  }

  private getUltimoDiario(): Diario {
    return this.diarios.length >= 0 
      ? this.diarios[this.diarios.length - 1]
      : null;
}
}
