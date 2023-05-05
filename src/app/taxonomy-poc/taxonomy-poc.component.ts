import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs';
import { JobSearchAPIService, JobSearchCompleteRequest } from '../job-search-api.service';
import { SemanticConceptSearchAPIService, SemanticConceptSearchRequest } from '../semantic-concept-search-api.service';
import { TaxonomyConcept } from '../taxonomy.service';

@Component({
  selector: 'app-taxonomy-poc',
  templateUrl: './taxonomy-poc.component.html',
  styleUrls: ['./taxonomy-poc.component.css']
})
export class TaxonomyPOCComponent {

  autocompleteControl = new FormControl('');
  autocompleteItems: Observable<string[]> | undefined;
  competensRecommendatios: TaxonomyConcept[] = []

  constructor(
    private jobsearch: JobSearchAPIService,
    private sematicSearch: SemanticConceptSearchAPIService) { }

  ngOnInit() {
    this.autocompleteItems = this.autocompleteControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(value => {
        const request: JobSearchCompleteRequest = {
          q: value ?? '',
          qfields: ['skill']
        }
        return this.jobsearch.complete(request)
      }),
      map(response => {
        return response.typeahead.map(item => item.value)
      })
    );
  }

  submitKeyword() {
    console.log(this.autocompleteControl.value);
    const keyword = this.autocompleteControl.value ?? ''
    const request: SemanticConceptSearchRequest = {
      array_of_words: [keyword],
      concept_type: 'skill',
      limit_number: 20
    }
    this.sematicSearch.conceptSearch(request).subscribe(response => {
      console.log(response);
      this.competensRecommendatios = response[keyword].map(response => {
        return new TaxonomyConcept(response.id, response.type, response.preferred_label)
      })
    })
  }
}
