import { Component } from '@angular/core';
import { SelectableTaxonomyConcept } from '../app.component';
import { TaxonomyConcept } from '../taxonomy.service';
import { OntologyService } from '../ontology.service';
import { JobedConnectAPIService, JobedMatchByTextRequest } from '../jobed-connect-api.service';

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
  recomendedOccupations: TaxonomyConcept[] = []

  constructor(private ontology: OntologyService, private jobed: JobedConnectAPIService) { }

  selectOccupation(item: TaxonomyConcept) {
    this.selectedOccupation = item
    this.ontology.getEnrichedOccupation(item.id).subscribe(value => {
      var allValues = value.metadata.enriched_candidates_term_frequency.competencies
      this.terms = allValues
        .filter(value => { return value.percent_for_occupation >= 1 })
        .map(value => { return value.term })
        this.extraTerms = allValues
        .filter(value => { return value.percent_for_occupation < 1 })
        .map(value => { return value.term })
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
}
