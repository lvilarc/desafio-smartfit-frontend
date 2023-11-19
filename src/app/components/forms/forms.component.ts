import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GetUnitsService } from '../../services/get-units.service';
import { HttpClientModule } from '@angular/common/http';
import { Location } from '../../types/location.interface';
import { FilterUnitsService } from '../../services/filter-units.service';


@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.css'
})
export class FormsComponent implements OnInit {
  @Output() submitEvent = new EventEmitter();
  results: any[] = [];
  filteredResults: any[] = [];
  formGroup!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private unitsService: GetUnitsService,
    private filterUnitsService: FilterUnitsService) {

  }

  ngOnInit(): void {
    this.unitsService.getAllUnits().subscribe(data => {
      this.results = data;
      this.filteredResults = data;
    });

    this.formGroup = this.formBuilder.group({
      hour: '',
      showClosed: true
    });
  }



  onSubmit(): void {
    let { showClosed, hour } = this.formGroup.value;
    this.filteredResults = this.filterUnitsService.filter(this.results, showClosed, hour)
    this.unitsService.setFilteredUnits(this.filteredResults);

    this.submitEvent.emit();
  }

  onClean(): void {
    this.formGroup.reset();
  }
}
