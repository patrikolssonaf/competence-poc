import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

}

export interface Autocomplete {
  'taxonomy/id': string;
  'taxonomy/type': string;
  'taxonomy/preferred-label': string;
}

export class TaxonomyConcept {
  id: string;
  type: string;
  preferredLabel: string;

  constructor(item: Autocomplete) {
    this.id = item['taxonomy/id']
    this.preferredLabel = item['taxonomy/preferred-label']
    this.type = item['taxonomy/type']
  }
}