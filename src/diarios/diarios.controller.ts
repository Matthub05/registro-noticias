import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DiariosService } from './diarios.service';
import { CreateDiarioDto } from './dto/create-diario.dto';
import { UpdateDiarioDto } from './dto/update-diario.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterNewsDto } from './dto/register-news.dto';

@ApiTags('Diarios')
@Controller('diarios')
export class DiariosController {
  constructor(private readonly diariosService: DiariosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un diario' })
  @ApiResponse({ status: 201, description: 'Diario creado' })
  create(@Body() createDiarioDto: CreateDiarioDto) {
    return this.diariosService.create(createDiarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los diarios' })
  findAll() {
    return this.diariosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un diario por id' })
  @ApiResponse({ status: 404, description: 'Diario no encontrado' })
  @ApiResponse({ status: 200, description: 'Diario encontrado' })
  findOne(@Param('id') id: string) {
    return this.diariosService.findOne(+id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar un diario' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'name' },
        description: { type: 'string', example: 'description' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Diario no encontrado' })
  @ApiResponse({ status: 200, description: 'Diario actualizado' })
  update(@Param('id') id: string, @Body() updateDiarioDto: UpdateDiarioDto) {
    return this.diariosService.update(+id, updateDiarioDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un diario' })
  @ApiResponse({ status: 404, description: 'Diario no encontrado' })
  @ApiResponse({ status: 200, description: 'Diario eliminado' })
  remove(@Param('id') id: string) {
    return this.diariosService.remove(+id);
  }

  @Post('news')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar noticias' })
  @ApiResponse({ status: 404, description: 'Diario no encontrado' })
  @ApiResponse({ status: 409, description: 'La fecha no puede ser del pasado' })
  @ApiResponse({
    status: 410,
    description: 'La noticia no cumple con las estadísticas. Razón: ...',
  })
  @ApiResponse({ status: 201, description: 'Noticia registrada' })
  registerNews(@Body() body: RegisterNewsDto) {
    return this.diariosService.registerNews(body);
  }

  @Get('reporte/:id')
  @ApiOperation({
    summary: 'Obtener reporte de un diario por su id',
  })
  @ApiResponse({ status: 404, description: 'Diario no encontrado' })
  @ApiResponse({ status: 200, description: 'Reporte encontrado' })
  getReport(@Param('id') id: string) {
    return this.diariosService.getReport(+id);
  }

  @Get('reporte/ultimaSemana/:id')
  @ApiOperation({
    summary: 'Obtener reporte de la última semana de un diario por su id',
  })
  @ApiResponse({ status: 404, description: 'Diario no encontrado' })
  @ApiResponse({ status: 200, description: 'Reporte encontrado' })
  getWeeklyReport(@Param('id') id: string) {
    return this.diariosService.getWeeklyReport(+id);
  }
}
