import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'El id del diario' })
  idDiario: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'El mensaje de la notificación' })
  message: string;
}
