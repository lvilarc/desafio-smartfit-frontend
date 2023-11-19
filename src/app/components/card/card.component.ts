import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '../../types/location.interface';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {
  @Input() card!: Location;

  constructor() {}

  ngOnInit(): void {
    
  }
}
