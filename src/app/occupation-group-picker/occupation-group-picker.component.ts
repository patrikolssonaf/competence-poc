import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-occupation-group-picker',
  templateUrl: './occupation-group-picker.component.html',
  styleUrls: ['./occupation-group-picker.component.css']
})
export class OccupationGroupPickerComponent {

  @Output() occupationGroup = new EventEmitter<TaxonomyConcept>();
  occupationGroupControl = new FormControl('');
  occupationGroups: Observable<Autocomplete[]> | undefined;

  constructor(private http: HttpClient) { }
  
  ngOnInit() {
    this.occupationGroups = this.occupationGroupControl.valueChanges.pipe(
      //startWith(''),
      //map(value => this._filter(value || '')),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(value => this.autocomplete(value))
/*       switchMap(term =>
        //term = term.trim();
        return this.http.get<Autocomplete[]>('https://taxonomy.api.jobtechdev.se/v1/taxonomy/suggesters/autocomplete?query-string=da&type=ssyk-level-4');
        ) */
    );
  }

  autocomplete(term: string | null): Observable<Autocomplete[]> {
    term = term ? term.trim() : '';
  
    // Add safe, URL encoded search parameter if there is a search term
    const options = term ?
     { params: new HttpParams().set('query-string', term).set('type', 'ssyk-level-4') } : {};
  
    return this.http.get<Autocomplete[]>('https://taxonomy.api.jobtechdev.se/v1/taxonomy/suggesters/autocomplete', options)
  }

  displayFn(item: Autocomplete): string {
    return item['taxonomy/preferred-label'];
  }

  select(item: Autocomplete) {
    let concept = new TaxonomyConcept(item)
    this.occupationGroup.emit(concept)
    console.log(concept.preferredLabel);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return ['Test 1', 'Test 2'];
  }

}

export interface Autocomplete {
  'taxonomy/id': string;
  'taxonomy/type': string;
  'taxonomy/preferred-label': string;
}

export class TaxonomyConcept {
  id: string;
  type: string;
  preferredLabel: string;

  constructor(item: Autocomplete) {
    this.id = item['taxonomy/id']
    this.preferredLabel = item['taxonomy/preferred-label']
    this.type = item['taxonomy/type']
  }
}