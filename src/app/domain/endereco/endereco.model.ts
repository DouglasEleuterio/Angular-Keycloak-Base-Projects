import { Cidade } from './cidade.model';

export class Endereco {
  id: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  cidade: Cidade;
}
