import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GetUnitsService } from '../../services/get-units.service';
import { HttpClientModule } from '@angular/common/http';
import { Location } from '../../types/location.interface';

const OPENING_HOURS = {
  morning: {
    first: '06',
    last: '12'
  },
  afternoon: {
    first: '12',
    last: '18'
  },
  night: {
    first: '18',
    last: '23'
  }
}

type HOUR_INDEXES = 'morning' | 'afternoon' | 'night';


@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.css'
})
export class FormsComponent implements OnInit {
  results: any = [];
  filteredResults: any = [];
  formGroup!: FormGroup;

  constructor(private formBuilder: FormBuilder, private unitsService: GetUnitsService) {

  }

  ngOnInit(): void {
    this.unitsService.getAllUnits().subscribe(data => {
      this.results = data.locations;
      this.filteredResults = data.locations;
    });

    this.formGroup = this.formBuilder.group({
      hour: '',
      showClosed: true
    });
  }

  transformWeekday(weekday: number) {
    switch (weekday) {
      case 0:
        return 'Dom.';
      case 6:
        return 'Sáb.';
      default:
        return 'Seg. à Sex.';
    }
  }

  filterUnits(unit: Location, open_hour: string, close_hour: string) {
    if (!unit.schedules) return true;

    let open_hour_filter = parseInt(open_hour, 10)
    let close_hour_filter = parseInt(close_hour, 10)

    let todays_weekday = this.transformWeekday(new Date().getDay());

    for (let i = 0; i < unit.schedules.length; i++) {
      let schedule_hour = unit.schedules[i].hour
      let schedule_weekday = unit.schedules[i].weekdays
      if (todays_weekday === schedule_weekday) {
        if (schedule_hour !== 'Fechada') {
          let [unit_open_hour, unit_close_hour] = schedule_hour.split(' às ')
          let unit_open_hour_int = parseInt(unit_open_hour.replace('h', ''), 10)
          let unit_close_hour_int = parseInt(unit_close_hour.replace('h', ''), 10)

          if (unit_open_hour_int <= open_hour_filter && unit_close_hour_int >= close_hour_filter) return true
          else return false
        }
      }
    }

    return false;
  }

  onSubmit(): void {
    let intermediateResults = this.results;

    if (!this.formGroup.value.showClosed) {
      intermediateResults = this.results.filter((location: Location) => location.opened === true);
    }
    if (this.formGroup.value.hour) {
      const OPEN_HOUR = OPENING_HOURS[this.formGroup.value.hour as HOUR_INDEXES].first;
      const CLOSE_HOUR = OPENING_HOURS[this.formGroup.value.hour as HOUR_INDEXES].last;
      this.filteredResults = intermediateResults.filter((location: Location) => this.filterUnits(location, OPEN_HOUR, CLOSE_HOUR))
    } else {
      this.filteredResults = intermediateResults;
    }

  }

  onClean(): void {
    this.formGroup.reset();
  }
}
