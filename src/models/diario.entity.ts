import { News } from "./news.entity";

export class Diario {
  id: number;
  name: string;
  description: string;
  news: News[];
}
