import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDiarioDto } from './dto/create-diario.dto';
import { UpdateDiarioDto } from './dto/update-diario.dto';
import { Diario } from '../models/diario.entity';
import { RegisterNewsDto } from './dto/register-news.dto';
import { News } from '../models/news.entity';
import { AlmacenamientoService } from '../services/almacenamiento.service';
import {
  getAverage,
  getCoefficientOfVariation,
  getFrequencyDistributionTable,
  getInterquartileRange,
  getPercentage,
  getStandardDeviation,
  isInHigherFrequency,
} from 'src/helpers/math-helper';
import { NotificacionService } from 'src/notificacion/notificacion.service';
import { CreateNotificationDto } from 'src/notificacion/dto/create-notification.dto';

@Injectable()
export class DiariosService {
  private diarios: Diario[] = [];

  constructor(
    private readonly almacenamiento: AlmacenamientoService,
    private readonly notificacionService: NotificacionService,
  ) {
    this.diarios = this.almacenamiento.getDiarios();
  }

  create(diario: CreateDiarioDto) {
    const { name, description } = diario;
    const idUltimoDiario = this.getUltimoDiario()?.id || 0;
    const id = idUltimoDiario + 1;
    const nuevoDiario: Diario = { id, name, description, news: [] };
    this.diarios.push(nuevoDiario);
    this.almacenamiento.guardarDiarios();
    return nuevoDiario;
  }

  findAll() {
    return this.diarios;
  }

  findOne(id: number) {
    const diario = this.diarios.find((d) => d.id === id);
    if (!diario) throw new NotFoundException('Diario no encontrado');
    return diario;
  }

  update(id: number, updateDiarioDto: UpdateDiarioDto) {
    const diario = this.findOne(id);
    if (!diario) throw new NotFoundException('Diario no encontrado');
    const { name, description } = updateDiarioDto;
    diario.name = name;
    diario.description = description;
    this.almacenamiento.guardarDiarios();
    return diario;
  }

  remove(id: number) {
    const index = this.diarios.findIndex((d) => d.id === id);
    if (index === -1) throw new NotFoundException('Diario no encontrado');

    this.diarios.splice(index, 1);

    this.almacenamiento.guardarDiarios();
    return { message: 'Diario eliminado exitosamente' };
  }

  async registerNews(registerNews: RegisterNewsDto) {
    const { idDiario, date, amount } = registerNews;
    const diario = this.findOne(idDiario);
    if (!diario) throw new NotFoundException('Diario no encontrado');

    const currentDate = new Date();
    const newsDate = new Date(date);
    if (newsDate < currentDate) {
      throw new ConflictException('La fecha no puede ser del pasado');
    }

    for (const news of diario.news) {
      if (news.date.getTime() === newsDate.getTime()) {
        news.amount += amount;
        this.almacenamiento.guardarDiarios();
        await this.checkAndNotify(diario, newsDate, news.amount);
        return diario;
      }
    }

    const news: News = { date, amount };
    if (!this.validarEstadisticas(news, diario.news)) {
      throw new ConflictException('La noticia no cumple con las estadísticas');
    }

    diario.news.push(news);
    this.almacenamiento.guardarDiarios();
    await this.checkAndNotify(diario, newsDate, amount);
    return diario;
  }

  private async checkAndNotify(diario: Diario, date: Date, amount: number) {
    const seisMesesAtras = new Date();
    seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6);

    const noticiasRelevantes = diario.news.filter(
      (news) =>
        news.date >= seisMesesAtras && news.date.getDay() === date.getDay(),
    );

    const promedio = getAverage(noticiasRelevantes.map((n) => n.amount));
    const limite = getPercentage(80, promedio);

    if (amount < limite) {
      const notificacion: CreateNotificationDto = {
        message: `La cantidad de artículos (${amount}) está por debajo del umbral esperado (${limite.toFixed(2)}) para el diario ${diario.name}.`,
      };
      await this.notificacionService.sendNotification(notificacion);
    }
  }

  private validarEstadisticas(nuevaNoticia: News, noticias: News[]): boolean {
    const cantidades = noticias.map((n) => n.amount);

    // Si hay menos de 3 noticias, no se valida
    if (cantidades.length < 3) {
      return true;
    }

    // Calcular el promedio y validar si la nueva noticia es mayor al 80% del promedio
    const promedio = getAverage(cantidades);
    if (getPercentage(80, promedio) <= nuevaNoticia.amount) {
      return true;
    }

    // Calcular el coeficiente de variación y validar si es mayor al 25%
    const desviacionEstandar = getStandardDeviation(
      [...cantidades, nuevaNoticia.amount],
      { average: promedio },
    );
    const coeficienteVariacion = getCoefficientOfVariation(
      desviacionEstandar,
      promedio,
    );

    if (coeficienteVariacion > 0.25) {
      // Si el coeficiente de variación es mayor al 25%, se revisa rango intercuartil
      const [q1, q3] = getInterquartileRange([
        ...cantidades,
        nuevaNoticia.amount,
      ]);
      return nuevaNoticia.amount >= q1;
    } else {
      // Si el coeficiente de variación es menor al 25%, se revisa tabla de frecuencias
      const tablaFrecuencias = getFrequencyDistributionTable(cantidades);
      return isInHigherFrequency(nuevaNoticia.amount, tablaFrecuencias);
    }
  }

  getWeeklyReport(diarioId: number) {
    const diario = this.findOne(diarioId);
    const hoy = new Date();
    const semanaPasada = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);

    const noticiasSemana = diario.news.filter(
      (news) => news.date >= semanaPasada && news.date <= hoy,
    );

    return noticiasSemana.map((news) => ({
      date: news.date,
      amount: news.amount,
    }));
  }

  private getUltimoDiario(): Diario {
    return this.diarios.length >= 0
      ? this.diarios[this.diarios.length - 1]
      : null;
  }
}
