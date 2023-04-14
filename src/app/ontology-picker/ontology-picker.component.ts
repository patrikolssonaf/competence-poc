import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { TaxonomyConcept, Autocomplete, TaxonomyService } from '../taxonomy.service';
import { OntologyItem, OntologyService } from '../ontology.service';

@Component({
  selector: 'app-ontology-picker',
  templateUrl: './ontology-picker.component.html',
  styleUrls: ['./ontology-picker.component.css']
})
export class OntologyPickerComponent {
  @Output() occupationGroup = new EventEmitter<string>();
  ontologyGroupControl = new FormControl('');
  ontologyGroups: Observable<OntologyItem[]> | undefined;

  constructor(private ontology: OntologyService) { }
  
  ngOnInit() {
    this.ontologyGroups = this.ontologyGroupControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(value => this.ontology.getSuggestions(value))
    );
  }

  displayFn(item: OntologyItem): string {
    if (typeof item.term != 'string' || !item.term || item.term.length < 1) {
      return ""
    }
    if (typeof item.concept != 'string' || !item.concept || item.concept.length < 1) {
      return item.term
    } else {
      return item.term + " (" + item.concept + ")"
    }
  }

  select(item: OntologyItem) {
    this.occupationGroup.emit(item.term)
  }
}
