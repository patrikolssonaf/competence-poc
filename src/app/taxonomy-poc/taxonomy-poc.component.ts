import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs';
import { JobSearchAPIService, JobSearchCompleteRequest } from '../job-search-api.service';
import { SemanticConceptSearchAPIService, SemanticConceptSearchRequest } from '../semantic-concept-search-api.service';
import { TaxonomyConcept } from '../taxonomy.service';
import { MatChipSelectionChange } from '@angular/material/chips';
import { JobedMatchByTextRequest } from '../jobed-connect-api.service';

@Component({
  selector: 'app-taxonomy-poc',
  templateUrl: './taxonomy-poc.component.html',
  styleUrls: ['./taxonomy-poc.component.css']
})
export class TaxonomyPOCComponent {

  autocompleteControl = new FormControl('');
  autocompleteItems: Observable<string[]> | undefined;
  competensRecommendatios: TaxonomyConcept[] = []
  selectedCompetenceRecomendation: Set<TaxonomyConcept> = new Set()
  occupationRecommendatios: TaxonomyConcept[] = []

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
    const keyword = this.autocompleteControl.value ?? ''
    const request: SemanticConceptSearchRequest = {
      array_of_words: [keyword],
      concept_type: 'skill',
      limit_number: 20
    }
    this.sematicSearch.conceptSearch(request).subscribe(response => {
      this.competensRecommendatios = response[keyword].map(response => {
        return new TaxonomyConcept(response.id, response.type, response.preferred_label)
      })
    })
  }

  selectCompetenceRecomendation(event: MatChipSelectionChange, item: TaxonomyConcept) {
    if (event.selected) {
      this.selectedCompetenceRecomendation.add(item)
    } else {
      this.selectedCompetenceRecomendation.delete(item)
    }
    if (event.isUserInput) {
      const keywords = Array.from(this.selectedCompetenceRecomendation).map(value => value.preferredLabel)
      const request: SemanticConceptSearchRequest = {
        array_of_words: keywords,
        concept_type: 'occupation-name',
        limit_number: 5
      }
      this.sematicSearch.conceptSearch(request).subscribe(response => {
        this.occupationRecommendatios = []
        for (const keyword of keywords) {
          const concepts = response[keyword].map(response => {
            return new TaxonomyConcept(response.id, response.type, response.preferred_label)
          })
          concepts.forEach(item => {
            if(this.occupationRecommendatios.some(value => value.id === item.id)){
              // Object already in array, do nothing
          } else{
            this.occupationRecommendatios.push(item)
          }
          })
        }
      })
    }
  }

  isCompetenceRecomendationSelected(item: TaxonomyConcept): boolean {
    return this.selectedCompetenceRecomendation.has(item)
  }
}
