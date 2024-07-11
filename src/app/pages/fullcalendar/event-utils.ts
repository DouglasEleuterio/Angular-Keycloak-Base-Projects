import { EventInput } from '@fullcalendar/core';

let eventGuid = 0;
const TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

export const INITIAL_EVENTS: EventInput[] = [
  {
    id: createEventId(),
    title: 'Depilação Lazer - Virilha Completa - Luciana Pereira',
    procedimento: 'Depilação Lazer',
    regiao: 'Virilha Completa',
    paciente: 'Luciana Pereira',
    whatsapp: '(62)99999-9999',
    start: TODAY_STR + 'T09:30:00',
    end: TODAY_STR + 'T09:45:00',

    backgroundColor: '#799496'
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
