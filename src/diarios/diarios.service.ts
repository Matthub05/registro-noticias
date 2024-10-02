import { Injectable } from '@nestjs/common';
import { CreateDiarioDto } from './dto/create-diario.dto';
import { UpdateDiarioDto } from './dto/update-diario.dto';
import { AlmacenamientoService } from 'src/almacenamiento/almacenamiento.service';
import { Diario } from './entities/diario.entity';
import { RegisterNewsDto } from './dto/register-news.dto';
import { News } from './entities/news.entity';

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
    return this.diarios.find(d => d.id === id);
  }

  update(id: number, updateDiarioDto: UpdateDiarioDto) {
    const diario = this.findOne(id);
    if (!diario) {
      return "Diario no encontrado";
    }
    const { name, description } = updateDiarioDto;
    diario.name = name;
    diario.description = description;
    this.almacenamiento.guardarDatos();
    return diario;
  }

  remove(id: number) {
    const index = this.diarios.findIndex(d => d.id === id);
    if (index === -1) {
      return "Diario no encontrado";
    }
    this.diarios.splice(index, 1);
    this.almacenamiento.guardarDatos();
    return "Diario eliminado";
  }

  registerNews(registerNews: RegisterNewsDto) {
    const { idDiario, date, amount } = registerNews;
    const diario = this.findOne(idDiario);
    if (!diario) {
      return "Diario no encontrado";
    }
  
    const currentDate = new Date();
    const newsDate = new Date(date);
    if (newsDate < currentDate) {
      return "La fecha no puede ser del pasado";
    }
    
    const news: News = { date, amount };
    diario.news.push(news);
    this.almacenamiento.guardarDatos();
    return diario;
  }

  private getUltimoDiario(): Diario {
    return this.diarios.length >= 0 
      ? this.diarios[this.diarios.length - 1]
      : null;
}
}
