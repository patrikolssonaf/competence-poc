import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobedConnectAPIService {

  constructor(private http: HttpClient) { }

  occupationsMatchByText(request: JobedMatchByTextRequest): Observable<JobedMatchByTextResponse> {
    return this.http.post<JobedMatchByTextResponse>('https://jobed-connect-api.jobtechdev.se/v1/occupations/match-by-text', request)
  }

}

export interface JobedMatchByTextRequest {
  input_text: string
}

export interface IdentifiedKeywords {
  competencies: string[];
  occupations: string[];
}

export interface OccupationGroup {
  occupation_group_label: string;
  concept_taxonomy_id: string;
  ssyk: string;
}

export interface Metadata {
  enriched_ads_count: number;
  enriched_ads_total_count: number;
  enriched_ads_percent_of_total: number;
  match_score: number;
}

export interface RelatedOccupation {
  id: string;
  occupation_label: string;
  concept_taxonomy_id: string;
  legacy_ams_taxonomy_id: string;
  occupation_group: OccupationGroup;
  metadata: Metadata;
}

export interface JobedMatchByTextResponse {
  hits_total: number;
  hits_returned: number;
  identified_keywords_for_input: IdentifiedKeywords;
  related_occupations: RelatedOccupation[];
}
