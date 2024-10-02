import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DiariosService } from './diarios.service';
import { CreateDiarioDto } from './dto/create-diario.dto';
import { UpdateDiarioDto } from './dto/update-diario.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterNewsDto } from './dto/register-news.dto';

@ApiTags('diarios')
@Controller('diarios')
export class DiariosController {
  constructor(private readonly diariosService: DiariosService) {}

  @Post()
  @ApiOperation({summary: 'Crear un diario'})
  create(@Body() createDiarioDto: CreateDiarioDto) {
    return this.diariosService.create(createDiarioDto);
  }

  @Get()
  @ApiOperation({summary: 'Listar todos los diarios'})
  findAll() {
    return this.diariosService.findAll();
  }

  @Get(':id')
  @ApiOperation({summary: 'Obtener un diario por id'})
  findOne(@Param('id') id: string) {
    return this.diariosService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({summary: 'Actualizar un diario'})
  update(@Param('id') id: string, @Body() updateDiarioDto: UpdateDiarioDto) {
    return this.diariosService.update(+id, updateDiarioDto);
  }

  @Delete(':id')
  @ApiOperation({summary: 'Eliminar un diario'})
  remove(@Param('id') id: string) {
    return this.diariosService.remove(+id);
  }

  @Post('news')
  @ApiOperation({summary: 'Registrar noticias'})
  registerNews(@Body() body: RegisterNewsDto) {
    return this.diariosService.registerNews(body);
  }

}
