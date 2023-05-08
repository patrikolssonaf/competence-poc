import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JobedMatchByTextResponse } from './jobed-connect-api.service';

@Injectable({
  providedIn: 'root'
})
export class SemanticConceptSearchAPIService {

  constructor(private http: HttpClient) { }

  conceptSearch(request: SemanticConceptSearchRequest): Observable<SemanticConceptSearchResponse> {
    return this.http.post<SemanticConceptSearchResponse>('https://semantic-concept-search-semantic-concept-search-prod.prod.services.jtech.se/semantic-concept-search/', request)
  }
}

export interface SemanticConceptSearchRequest {
  array_of_words: string[];
  concept_type: string;
  limit_number: number;
}

export interface SemanticConceptItem {
  id: string;
  type: string;
  preferred_label: string;
  alternative_labels: string[];
  hidden_labels: string[];
  matched_label: string;
  distance: string;
}

export interface SemanticConceptSearchResponse {
  [key: string]: SemanticConceptItem[];
}