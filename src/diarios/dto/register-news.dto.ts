import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, Min, MinDate } from "class-validator";

export class RegisterNewsDto {

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({description: 'El id del diario'})
  idDiario: number;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({description: 'La fecha de la noticia'})
  date: Date;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({description: 'La cantidad de noticias'})
  amount: number;

}