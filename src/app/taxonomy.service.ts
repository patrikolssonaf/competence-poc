import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaxonomyService {

  constructor(private http: HttpClient) { }

  autocomplete(term: string | null): Observable<Autocomplete[]> {
    term = term ? term.trim() : '';
  
    // Add safe, URL encoded search parameter if there is a search term
    const options = term ?
     { params: new HttpParams().set('query-string', term).set('type', 'ssyk-level-4') } : {};
  
    return this.http.get<Autocomplete[]>('https://taxonomy.api.jobtechdev.se/v1/taxonomy/suggesters/autocomplete', options)
  }

  skillLookup(concept_id: string): Observable<TaxonomyConcept[]> {
  
    const query = `
    query MyQuery {
      concepts(id: "${concept_id}") {
        id
        type
        preferred_label
        related(type: "skill") {
          id
          preferred_label
          type
          broader {
            id
            preferred_label
          }
        }
      }
    }
    `
    const options = { params: new HttpParams().set('query', query) };
  
    return this.http.get<SkillLookupResponse>('https://taxonomy.api.jobtechdev.se/v1/taxonomy/graphql', options).pipe(
      map(response => {
        return response.data.concepts[0].related.map(related => {
          return new TaxonomyConcept(related.id, related.type, related.preferred_label)
        })
      })
    )
  }

}

export interface Autocomplete {
  'taxonomy/id': string;
  'taxonomy/type': string;
  'taxonomy/preferred-label': string;
}

export interface SkillLookupResponse {
  data: {
    concepts: [
      {
        id: string
        type: string
        preferred_label: string
        related: [
          {
            id: string
            preferred_label: string
            type: string
          }
        ]
      }
    ]
  }
}

export class TaxonomyConcept {
  id: string;
  type: string;
  preferredLabel: string;

  constructor(id: string, type: string, preferredLabel: string) {
    this.id = id
    this.type = type
    this.preferredLabel = preferredLabel
  }
}