import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DocumentEnriched, EnrichDocument, EnrichDocumentRequest, OntologyService } from '../ontology.service';
import { switchMap, tap } from 'rxjs';
import { SemanticConceptItem, SemanticConceptSearchAPIService, SemanticConceptSearchRequest, SemanticConceptSearchResponse } from '../semantic-concept-search-api.service';
import { TaxonomyConcept } from '../taxonomy.service';

@Component({
  selector: 'app-job-ad-enrichment',
  templateUrl: './job-ad-enrichment.component.html',
  styleUrls: ['./job-ad-enrichment.component.css']
})
export class JobAdEnrichmentComponent {

  headlineInputControl = new FormControl('');
  textInputControl = new FormControl('');
  enrichments: DocumentEnriched[] = []
  semanticConceptItems: SemanticConceptItem[] = []

  constructor(private ontology: OntologyService, private sematicSearch: SemanticConceptSearchAPIService) { }

  enrich() {
    const document: EnrichDocument = {
      doc_id: "",
      doc_headline: this.headlineInputControl.value ?? "",
      doc_text: this.textInputControl.value ?? ""
    }

    const documentRequest: EnrichDocumentRequest = {
      documents_input: [
        document
      ],
      include_terms_info: false,
      include_sentences: false,
      include_synonyms: false,
      include_misspelled_synonyms: false
    };
    
    this.ontology.getEnrichment(documentRequest).pipe(
      tap(response => {
        this.enrichments = response
      }),
      switchMap(response => {
        const competencies = response[0].enriched_candidates.competencies.map(item => item.concept_label)
        const request: SemanticConceptSearchRequest = {
          array_of_words: competencies,
          concept_type: 'skill',
          limit_number: 1
        }
        return this.sematicSearch.conceptSearch(request)
      })
    ).subscribe(response => {
      this.semanticConceptItems = []
        for (const keyword of this.enrichments[0].enriched_candidates.competencies.map(item => item.concept_label)) {
          const concepts = response[keyword].map(item => {
            this.semanticConceptItems.push(item)
          })
        }
    })
  }

  empty() {
    this.headlineInputControl.setValue("")
    this.textInputControl.setValue("")
  }
}
