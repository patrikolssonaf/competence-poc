import { Component } from '@angular/core';
import { SelectableTaxonomyConcept } from '../app.component';
import { TaxonomyConcept } from '../taxonomy.service';
import { OntologyService } from '../ontology.service';

@Component({
  selector: 'app-ontology',
  templateUrl: './ontology.component.html',
  styleUrls: ['./ontology.component.css']
})
export class OntologyComponent {

  selectedOccupation: TaxonomyConcept | undefined
  terms: string[] = []
  extraTerms: string[] = []

  constructor(private ontology: OntologyService) { }

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

}
