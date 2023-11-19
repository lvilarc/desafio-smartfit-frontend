import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetUnitsService } from '../../services/get-units.service';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-cards-list',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './cards-list.component.html',
  styleUrl: './cards-list.component.css'
})
export class CardsListComponent implements OnInit {
  @Input() unitsList: any[] = [];
  constructor(private unitService: GetUnitsService) {

  }

  ngOnInit(): void {
    this.unitsList = this.unitService.getFilteredUnits();
    console.log(this.unitsList);
  }
}
