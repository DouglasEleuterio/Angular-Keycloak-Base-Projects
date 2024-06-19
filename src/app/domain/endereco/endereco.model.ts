import { Cidade } from './cidade.model';

export class Endereco {
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  cidade: Cidade;
}
