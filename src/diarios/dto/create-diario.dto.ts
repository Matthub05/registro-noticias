import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateDiarioDto {
  
  @IsNotEmpty()
  @IsString()
  @ApiProperty({description: 'El nombre del diario'})
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({description: 'La descripción del diario'})
  description?: string;

}
