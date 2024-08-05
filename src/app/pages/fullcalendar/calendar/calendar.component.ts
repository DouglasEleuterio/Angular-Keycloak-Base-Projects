import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventChangeArg, EventClickArg, EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component({
  selector: 'app-calendar-root',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements AfterViewInit {
  @ViewChild('calendar')
  calendar: FullCalendarComponent;

  @Output() pageLoaded: EventEmitter<void> = new EventEmitter<void>();
  @Output() eventClick: EventEmitter<EventClickArg> = new EventEmitter<EventClickArg>();
  @Output() eventChange: EventEmitter<EventChangeArg> = new EventEmitter<EventChangeArg>();
  @Output() eventDateSelect: EventEmitter<DateSelectArg> = new EventEmitter<DateSelectArg>();

  public eventosInicial: EventInput[] = [];
  changeDetector: ChangeDetectorRef;

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
    // initialDate: ,
    views: {
      timeGridWeek: {
        type: 'timeGridWeek',
        slotMinTime: '07:00:00',
        slotMaxTime: '21:00:00',
        slotDuration: '00:10:00',
        dayHeaders: true,
        dayHeaderFormat: { weekday: 'long', day: 'numeric' },
        nowIndicator: true,
        slotLabelInterval: { minute: 10 },
        slotLabelFormat: {
          hour: '2-digit',
          minute: '2-digit',
          omitZeroMinute: false,
          meridiem: 'lowercase'
        }
      },
      dia: {
        type: 'timeGrid',
        slotMinTime: '07:00:00',
        slotDuration: '00:15:00',
        slotMaxTime: '21:00:00',
        slotLabelInterval: { minute: 5 },
        nowIndicator: true,
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
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventChange: this.handleEventChange.bind(this)
    // eventsSet: this.handleEvents.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };

  constructor(changeDetector: ChangeDetectorRef) {
    this.changeDetector = changeDetector;
  }

  ngAfterViewInit(): void {
    this.pageLoaded.emit();
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const calendarApi = this.getFullCalendar().getApi();
    calendarApi.unselect(); // clear date selection
    this.eventDateSelect.emit(selectInfo);
    calendarApi.gotoDate(selectInfo.start);
    calendarApi.changeView('dia');
  }

  handleEventChange(changeInfo: EventChangeArg) {
    this.eventChange.emit(changeInfo);
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.eventClick.emit(clickInfo);
  }

  public getFullCalendar(): FullCalendarComponent {
    return this.calendar;
  }
}
