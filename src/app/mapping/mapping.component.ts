import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { OntologyItem, OntologyService } from '../ontology.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { JobSearchAPIService, JobSearchSearchRequest } from '../job-search-api.service';
import { JobedConnectAPIService, JobedEnrichedOccupationsRequest } from '../jobed-connect-api.service';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.css']
})
export class MappingComponent {

  autocompleteControl = new FormControl('');
  autocompleteSkills: Observable<OntologyItem[]> | undefined;
  originSkill: OntologyItem | undefined
  recomendedSkills: string[] = []
  
  constructor(
    private jobsearch: JobSearchAPIService, 
    private ontology: OntologyService,
    private jobed: JobedConnectAPIService) { }
    
    ngOnInit() {
      this.autocompleteSkills = this.autocompleteControl.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(value => {
          return this.ontology.getSuggestions(value ?? "")
        })
      );
    }
    
  setOriginSkill(event: MatAutocompleteSelectedEvent) {
    console.log(event);
    this.originSkill = event.option.value
    this.fetchSkillRecomendations()
  }

  fetchSkillRecomendations() {
    this.recomendedSkills = []
    const request: JobSearchSearchRequest = {
      q: this.originSkill?.concept ?? "",
      limit: 0,
      stats: ['occupation-name'],
      "stats.limit": 1,
      skills: []
    }
    this.jobsearch.search(request).pipe(
      switchMap((value, index) => {
        const occupation = value.stats[0].values[0]
        const request: JobedEnrichedOccupationsRequest = {
          occupation_id: occupation.concept_id,
          include_metadata: true
        }
        return this.jobed.enrichedOccupations(request)
      })
    ).subscribe(value => {
      this.recomendedSkills = value.metadata.enriched_candidates_term_frequency.competencies
        .map(value => this.capitalizeFirstLetter(value.term))
        .slice(0, 20)
    })
  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  clearOriginSkill() {
    this.autocompleteControl.setValue("")
  }

  displayOriginSkill(item: OntologyItem) {
    return item.term
  }
}
