import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, debounceTime, distinctUntilChanged, flatMap, groupBy, map, mergeMap, of, switchMap, toArray, zip } from 'rxjs';
import { JobSearchAPIService, JobSearchCompleteRequest } from '../job-search-api.service';
import { SemanticConceptSearchAPIService, SemanticConceptSearchRequest } from '../semantic-concept-search-api.service';
import { TaxonomyConcept, TaxonomyService } from '../taxonomy.service';
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
  occupationGroupRecommendatios: TaxonomyConcept[] = []
  competensFromOccupationGroupRecommendatios: [string, GroupCompetence[]][] = []

  constructor(
    private jobsearch: JobSearchAPIService,
    private sematicSearch: SemanticConceptSearchAPIService,
    private taxonomy: TaxonomyService) { }

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
    this.competensRecommendatios = []
    this.occupationGroupRecommendatios = []
    this.competensFromOccupationGroupRecommendatios = []
    this.sematicSearch.conceptSearch(request).subscribe(response => {
      this.competensRecommendatios = response[keyword].map(response => {
        return new TaxonomyConcept(response.id, response.type, response.preferred_label)
      })
    })
  }

  selectCompetenceRecomendation(event: MatChipSelectionChange, item: TaxonomyConcept) {
    if (event.isUserInput) {
      this.occupationGroupRecommendatios = []
      this.competensFromOccupationGroupRecommendatios = []
      this.fetchOccupationGroups(item)
    }
  }

  fetchOccupationGroups(competence: TaxonomyConcept) {
    this.taxonomy.occupationGroupsFromCompetence(competence.id).subscribe(response => {
      response.forEach(item => {
        if (this.occupationGroupRecommendatios.some(value => value.id === item.id)) {
          // Object already in array, do nothing
        } else {
          this.occupationGroupRecommendatios.push(item)
        }
      })
    })
  }

  selectOccupationGroup(event: MatChipSelectionChange, item: TaxonomyConcept) {
    this.taxonomy.fetchOccupationGroup(item.id).pipe(
      mergeMap(response => {
        return response.data.concepts[0].related.map(c => {
          const item: GroupCompetence = {
            id: c.id,
            type: c.type,
            preferred_label: c.preferred_label,
            group: c.broader[0].preferred_label
          }
          return item
        })
      }),
      groupBy(concept => concept.group, c => c),
      mergeMap(group => zip(of(group.key), group.pipe(toArray()))),
      toArray()
    ).subscribe(value => {
      this.competensFromOccupationGroupRecommendatios = value
    })
  }

  selectCompetenceForProfile(event: MatChipSelectionChange, item: GroupCompetence) {
    console.log(item);
  }

}

interface GroupCompetence {
  id: string
  type: string
  preferred_label: string
  group: string
}
