import { Component } from '@angular/core';
import { SelectableTaxonomyConcept } from '../app.component';
import { TaxonomyConcept } from '../taxonomy.service';
import { OntologyService } from '../ontology.service';
import { JobedConnectAPIService, JobedEnrichedOccupationsRequest, JobedMatchByTextRequest } from '../jobed-connect-api.service';
import { JobSearchAPIService, JobSearchResponse, JobSearchSearchRequest } from '../job-search-api.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-ontology',
  templateUrl: './ontology.component.html',
  styleUrls: ['./ontology.component.css']
})
export class OntologyComponent {

  selectedOccupation: TaxonomyConcept | undefined
  terms: string[] = []
  extraTerms: string[] = []
  selectedSkills: string[] = []
  occupationForRecomendation: TaxonomyConcept | undefined
  recommendedSkills: string[] = []
  recomendedOccupations: TaxonomyConcept[] = []
  jobsearchResponse: JobSearchResponse | undefined

  constructor(
    private ontology: OntologyService, 
    private jobed: JobedConnectAPIService,
    private jobsearch: JobSearchAPIService
    ) { }

  selectOccupation(item: TaxonomyConcept) {
    this.selectedOccupation = item
    const request: JobedEnrichedOccupationsRequest = {
      occupation_id: item.id,
      include_metadata: true
    }
    this.jobed.enrichedOccupations(request).subscribe(value => {
      var allValues = value.metadata.enriched_candidates_term_frequency.competencies
      this.terms = allValues
        .filter(value => { return value.percent_for_occupation >= 1 })
        .map(value => { return value.term })
        this.extraTerms = allValues
        .filter(value => { return value.percent_for_occupation < 1 })
        .map(value => { return value.term })
    })
  }

  fetchRecomendations() {
    this.recommendedSkills = []
    const request: JobSearchSearchRequest = {
      q: this.selectedSkills[0],
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
        this.occupationForRecomendation = new TaxonomyConcept(occupation.concept_id, "occupation-name", occupation.term)
        return this.jobed.enrichedOccupations(request)
      })
    ).subscribe(value => {
      this.recommendedSkills = value.metadata.enriched_candidates_term_frequency.competencies.map(value => value.term)
    })
  }

  selectSkill(skill: string) {
    this.selectedSkills.push(skill)
  }

  fetchOccupations() {
    const request: JobedMatchByTextRequest = {
      input_text: this.selectedSkills.join(" ")
    }
    this.jobed.occupationsMatchByText(request).subscribe(response => {
      this.recomendedOccupations = response.related_occupations.map(value => {
        return new TaxonomyConcept(value.concept_taxonomy_id, "occupation-name", value.occupation_label)
      })
    })
  }

  fetchAds() {
    const request: JobSearchSearchRequest = {
      q: this.selectedSkills.join(" "),
      limit: 10,
      stats: [],
      "stats.limit": 0,
      skills: []
    }
    this.jobsearch.search(request).subscribe(response => {
      this.jobsearchResponse = response
    })
  }
}
