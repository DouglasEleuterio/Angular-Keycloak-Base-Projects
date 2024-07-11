import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { createEventId, INITIAL_EVENTS } from '../event-utils';
import { date } from '@rxweb/reactive-form-validators';

@Component({
  selector: 'app-calendar-root',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  @Input()
  diaInicial: Date | null = null;

  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    locale: 'brLocale',
    firstDay: 1,
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin],
    headerToolbar: {
      left: 'prev today next',
      center: 'title',
      right: 'timeGridWeek dayGridMonth dia'
    },
    buttonText: {
      today: 'hoje',
      month: 'mês',
      week: 'semana',
      day: 'dia',
      list: 'lista',
      // next: 'proximo',
      // prev: 'anterior',
      nextYear: 'próximo ano',
      prevYear: 'ano anterior'
    },
    initialDate: this.diaInicial,
    views: {
      timeGridWeek: {
        type: 'timeGridWeek',
        scrollTime: '08:00:00',
        slotDuration: '00:05:00',
        slotMaxTime: '19:00:00',
        slotLabelInterval: { minute: 30 },
        slotLabelFormat: {
          hour: '2-digit',
          minute: '2-digit',
          omitZeroMinute: false,
          meridiem: 'lowercase'
        }
      },
      dia: {
        type: 'timeGrid',
        slotMinTime: '08:00:00',
        slotDuration: '00:05:00',
        slotMaxTime: '19:00:00',
        slotLabelInterval: { minute: 5 },
        slotLabelFormat: {
          hour: '2-digit',
          minute: '2-digit',
          omitZeroMinute: false,
          meridiem: 'lowercase'
        }
      }
    },
    hiddenDays: [0],
    dayHeaders: true,
    dayHeaderFormat: { weekday: 'long' },
    initialView: 'timeGridWeek',
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };
  currentEvents: EventApi[] = [];
  eventos: any[] = [];

  constructor(private changeDetector: ChangeDetectorRef) {}

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.eventos = events;
    this.changeDetector.detectChanges();
  }
}
