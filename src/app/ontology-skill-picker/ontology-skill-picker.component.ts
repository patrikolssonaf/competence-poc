import { Component, EventEmitter, Output } from '@angular/core';
import { JobSearchAPIService, JobSearchCompleteRequest, JobSearchCompleteTypeAhead } from '../job-search-api.service';
import { FormControl } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs';
import { OntologyItem, OntologyService } from '../ontology.service';
import { JobedConnectAPIService } from '../jobed-connect-api.service';

@Component({
  selector: 'app-ontology-skill-picker',
  templateUrl: './ontology-skill-picker.component.html',
  styleUrls: ['./ontology-skill-picker.component.css']
})
export class OntologySkillPickerComponent {
  @Output() selectedSkill = new EventEmitter<string>();
  autocompleteControl = new FormControl('');
  skills: Observable<OntologyItem[]> | undefined;

  constructor(private jobsearch: JobSearchAPIService, private ontology: OntologyService) { }
  
  ngOnInit() {
    this.skills = this.autocompleteControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(value => {
        return this.ontology.getSuggestions(value ?? "")
      })
    );
  }

  displayFn(item: OntologyItem): string {
    //return `${item.term} (${item.concept})`
    return item.concept
  }

  select() {
    this.selectedSkill.emit(this.autocompleteControl.value ?? "")
  }

  empty() {
    this.autocompleteControl.setValue("")
  }
}
