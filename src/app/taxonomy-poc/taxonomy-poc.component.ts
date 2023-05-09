import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, concatMap, debounceTime, distinct, distinctUntilChanged, flatMap, from, groupBy, map, mergeMap, observeOn, of, switchMap, toArray, zip } from 'rxjs';
import { JobSearchAPIService, JobSearchCompleteRequest } from '../job-search-api.service';
import { SemanticConceptSearchAPIService, SemanticConceptSearchRequest } from '../semantic-concept-search-api.service';
import { TaxonomyConcept, TaxonomyGrapiQLRequest, TaxonomyService } from '../taxonomy.service';
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
  profileSkills: TaxonomyConcept[] = []
  occupationsForProfile: TaxonomyConcept[] = []

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
      limit_number: 50
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
    const skill: TaxonomyConcept = {
      id: item.id,
      type: item.type,
      preferredLabel: item.preferred_label
    }

    if(!this.profileSkills.some(s => s.id === item.id)){
      this.profileSkills.push(skill)
    }
    this.fetchOccupationsForProfile()
  }

  fetchOccupationsForProfile() {
    from(this.profileSkills).pipe(
      concatMap(concept => {
        const query = `
        query Atlas {
          concepts(id: "${concept.id}") {
            type
            preferred_label
            related(type: "ssyk-level-4") {
              id
              preferred_label
              type
              related(type: "occupation-name") {
                id
                preferred_label
              }
              narrower(type: "occupation-name") {
                id
                preferred_label
                type
              }
            }
            
          }
        }
        `
        const request: TaxonomyGrapiQLRequest = {
          query: query
        }
        return this.taxonomy.graphql(request)
      }),
      concatMap(response => response.data.concepts[0].related[0].narrower),
      distinct(({ id}) => id),
      map(response => {
        const concept: TaxonomyConcept = {
          id: response.id,
          type: response.type,
          preferredLabel: response.preferred_label
        }
        return concept
      }),
      toArray()
    ).subscribe(response => {
      this.occupationsForProfile = response
    })
  }

}

interface GroupCompetence {
  id: string
  type: string
  preferred_label: string
  group: string
}
