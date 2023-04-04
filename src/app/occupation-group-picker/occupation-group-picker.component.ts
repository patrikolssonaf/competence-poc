import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs';
import { Autocomplete, TaxonomyConcept, TaxonomyService } from '../taxonomy.service';

@Component({
  selector: 'app-occupation-group-picker',
  templateUrl: './occupation-group-picker.component.html',
  styleUrls: ['./occupation-group-picker.component.css']
})
export class OccupationGroupPickerComponent {

  @Output() occupationGroup = new EventEmitter<TaxonomyConcept>();
  occupationGroupControl = new FormControl('');
  occupationGroups: Observable<Autocomplete[]> | undefined;

  constructor(private taxonomy: TaxonomyService) { }
  
  ngOnInit() {
    this.occupationGroups = this.occupationGroupControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(value => this.taxonomy.autocomplete(value))
    );
  }

  displayFn(item: Autocomplete): string {
    return item['taxonomy/preferred-label'];
  }

  select(item: Autocomplete) {
    let concept = new TaxonomyConcept(item['taxonomy/id'], item['taxonomy/type'], item['taxonomy/preferred-label'])
    this.occupationGroup.emit(concept)
    console.log(concept.preferredLabel);
  }

}
