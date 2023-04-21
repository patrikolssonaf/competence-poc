import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { OntologyItem, OntologyService } from '../ontology.service';
import { JobSearchAPIService, JobSearchResponse, JobSearchSearchRequest } from '../job-search-api.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-poc',
  templateUrl: './poc.component.html',
  styleUrls: ['./poc.component.css']
})
export class PocComponent {

  autocompleteControl = new FormControl('');
  autocompleteSkills: Observable<OntologyItem[]> | undefined;
  originSkill: OntologyItem | undefined
  jobsearchResponse: JobSearchResponse | undefined
  jobsearchRequest: JobSearchSearchRequest | undefined

  constructor(private jobsearch: JobSearchAPIService, private ontology: OntologyService) { }
  
  ngOnInit() {
    this.autocompleteSkills = this.autocompleteControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(value => {
        return this.ontology.getSuggestions(value ?? "")
      })
    );
  }

  clearOriginSkill() {
    this.autocompleteControl.setValue("")
  }

  setOriginSkill(event: MatAutocompleteSelectedEvent) {
    console.log(event);
    this.originSkill = event.option.value
    this.fetchJobAds()
  }
  
  displayOriginSkill(item: OntologyItem) {
    return item.term
  }

  fetchJobAds() {
    const request: JobSearchSearchRequest = {
      q: this.originSkill?.concept ?? "",
      limit: 10,
      stats: [],
      "stats.limit": 0
    }
    this.jobsearchRequest = request
    this.jobsearch.search(request).subscribe(response => {
      this.jobsearchResponse = response
    })
  }
}
