import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, shareReplay, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OntologyService {

  private jsonDataPath = 'assets/competence.json';
  private data$: Observable<OntologyItem[]>;

  constructor(private http: HttpClient) {
    this.data$ = this.http.get<AllOntologyItemResponse>(this.jsonDataPath).pipe(
      map(value => { return value.items }),
      catchError((error: any) => {
        console.error('Error fetching strings from JSON:', error);
        return of([]);
      }),
      shareReplay(1)
    );
  }

  getSuggestions(input: string | null): Observable<OntologyItem[]> {
    if (typeof input != 'string' || !input || input.length < 1) {
      return of([]);
    }

    return this.data$.pipe(
      map((strings: OntologyItem[]) =>
        strings.filter((str: OntologyItem) => {
          return str.term.toLowerCase().startsWith(input.toLowerCase());
        })
      )
    );
  }

  getEnrichment(request: EnrichDocumentRequest): Observable<DocumentEnriched[]> {
    return this.http.post<DocumentEnriched[]>("https://jobad-enrichments-api.jobtechdev.se/enrichtextdocumentsbinary", request);
  }

}

interface AllOntologyItemResponse {
  total: number;
  build_datetime: string;
  build_datetime_unix_epoch: number;
  items: OntologyItem[];
}

export interface OntologyItem {
  concept: string;
  term: string;
  term_misspelled: boolean;
  type: string;
  plural_occupation: boolean;
  definite_occupation: boolean;
}

export interface EnrichDocument {
  doc_id: string;
  doc_headline: string;
  doc_text: string;
}

export interface EnrichDocumentRequest {
  documents_input: EnrichDocument[];
  include_terms_info: boolean;
  include_sentences: boolean;
  include_synonyms: boolean;
  include_misspelled_synonyms: boolean;
}

export interface EnrichConcept {
  concept_label: string;
  term: string;
  sentence: string;
  sentence_index: number;
}

export interface EnrichedCandidates {
  occupations: EnrichConcept[];
  competencies: EnrichConcept[];
  traits: EnrichConcept[];
  geos: EnrichConcept[];
}

export interface DocumentEnriched {
  doc_id: string;
  doc_headline: string;
  enriched_candidates: EnrichedCandidates;
}
