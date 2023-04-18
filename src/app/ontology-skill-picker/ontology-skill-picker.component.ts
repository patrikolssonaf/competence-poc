import { Component, EventEmitter, Output } from '@angular/core';
import { JobSearchAPIService, JobSearchCompleteRequest, JobSearchCompleteTypeAhead } from '../job-search-api.service';
import { FormControl } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs';
import { OntologyItem } from '../ontology.service';

@Component({
  selector: 'app-ontology-skill-picker',
  templateUrl: './ontology-skill-picker.component.html',
  styleUrls: ['./ontology-skill-picker.component.css']
})
export class OntologySkillPickerComponent {
  @Output() selectedSkill = new EventEmitter<string>();
  autocompleteControl = new FormControl('');
  skills: Observable<JobSearchCompleteTypeAhead[]> | undefined;

  constructor(private jobsearch: JobSearchAPIService) { }
  
  ngOnInit() {
    this.skills = this.autocompleteControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(value => {
        const request: JobSearchCompleteRequest = {
          q: value ?? "",
          qfields: ["skill"]
        }
        return this.jobsearch.complete(request)
      }),
      map(value => value.typeahead)
    );
  }

  displayFn(item: JobSearchCompleteTypeAhead): string {
    return item.value
  }

  select() {
    this.selectedSkill.emit(this.autocompleteControl.value ?? "")
  }

  empty() {
    this.autocompleteControl.setValue("")
  }
}
