import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DocumentEnriched, EnrichDocument, EnrichDocumentRequest, OntologyService } from '../ontology.service';

@Component({
  selector: 'app-job-ad-enrichment',
  templateUrl: './job-ad-enrichment.component.html',
  styleUrls: ['./job-ad-enrichment.component.css']
})
export class JobAdEnrichmentComponent {

  headlineInputControl = new FormControl('');
  textInputControl = new FormControl('');
  enrichments: DocumentEnriched[] = []

  constructor(private ontology: OntologyService) { }

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
    
    this.ontology.getEnrichment(documentRequest).subscribe(value => {
      console.log(value)
      this.enrichments = value
    })
  }
}
