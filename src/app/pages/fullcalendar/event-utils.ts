import { EventInput } from '@fullcalendar/core';
import * as moment from 'moment';

const date = new Date();

let eventGuid = 0;
const TODAY_STR = date.toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today
const TOMORROW_STR = moment(date).add(1, 'day').format('YYYY-MM-DD');

export const INITIAL_EVENTS: EventInput[] = [
  {
    id: createEventId(),
    title: 'Locação equipamento',
    paciente: 'Goiania',
    whatsapp: '(62)99999-9999',
    start: TOMORROW_STR + 'T00:00:00',
    end: TOMORROW_STR + 'T23:59:00',
    backgroundColor: '#717ec3',
    overlap: false
  },
  {
    id: createEventId(),
    title: 'Depilação Lazer - Virilha Completa - Luciana Pereira',
    procedimento: 'Depilação Lazer',
    regiao: 'Virilha Completa',
    paciente: 'Luciana Pereira',
    whatsapp: '(62)99999-9999',
    start: TODAY_STR + 'T09:30:00',
    end: TODAY_STR + 'T09:45:00',
    backgroundColor: '#799496',
    overlap: false
  },
  {
    id: createEventId(),
    title: 'Botox Fullface - Rosto - Ludmila de Sá',
    procedimento: 'Botox',
    regiao: 'Fullface',
    paciente: 'Ludmila de Sá',
    whatsapp: '(62)99999-9999',
    start: TODAY_STR + 'T09:10:00',
    end: TODAY_STR + 'T10:20:00',
    backgroundColor: '#acc196'
  },
  {
    id: createEventId(),
    title: 'Depilação Lazer - Axilas - Patricia Fernandes',
    procedimento: 'Depilação Lazer',
    regiao: 'Axilas',
    paciente: 'Patricia Fernandes',
    whatsapp: '(62)99999-9999',
    start: TODAY_STR + 'T09:50:00',
    end: TODAY_STR + 'T10:30:00',
    backgroundColor: '#799496'
  }
];

export function createEventId() {
  return String(eventGuid++);
}
