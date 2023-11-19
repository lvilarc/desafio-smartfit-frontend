import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UnitsResponse } from '../types/units-response.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { Location } from '../types/location.interface';

@Injectable({
  providedIn: 'any'
})
export class GetUnitsService {
  readonly apiUrl = "https://test-frontend-developer.s3.amazonaws.com/data/locations.json"

  private allUnitsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private allUnits$: Observable<any[]> = this.allUnitsSubject.asObservable();
  private filteredUnits: any[] = [];
  
  constructor(private httpClient: HttpClient) {
    this.httpClient.get<UnitsResponse>(this.apiUrl).subscribe(data => {
      this.allUnitsSubject.next(data.locations);
      this.filteredUnits = data.locations;
    });
  }
   
  getAllUnits(): Observable<any[]> {
    return this.allUnits$;
  }

  getFilteredUnits() {
    return this.filteredUnits;
  }

  setFilteredUnits(value: any[]) {
    this.filteredUnits = value;
  }
}
