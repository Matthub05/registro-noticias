import { PartialType } from '@nestjs/mapped-types';
import { CreateDiarioDto } from './create-diario.dto';

export class UpdateDiarioDto extends PartialType(CreateDiarioDto) {}
