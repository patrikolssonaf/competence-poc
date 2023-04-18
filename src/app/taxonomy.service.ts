import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, concatAll, concatMap, flatMap, map, mergeMap } from 'rxjs';
import { JobSearchCompleteResponse, JobSearchResponse } from './job-search-api.service';

@Injectable({
  providedIn: 'root'
})
export class TaxonomyService {

  constructor(private http: HttpClient) { }

  autocomplete(term: string | null, type: string): Observable<Autocomplete[]> {
    var params = new HttpParams()

    console.log(term);
    if (typeof term === 'string') {
      term = term ? term.trim() : '';
      params = params.append('query-string', term)
    }

    // Add safe, URL encoded search parameter if there is a search term
    const options = term ?
     { params: new HttpParams().set('query-string', term).set('type', type) } : {};
  
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

  fetchJobSearchSkills(concepts: TaxonomyConcept[]): Observable<string[]> {
  
    let params = new HttpParams();

    params = params.append('qfields', 'skill')
    params = params.append('contextual', 'true')
    concepts.forEach(concept => {
      params = params.append(`skill`, concept.id);
    })

    const options = { params: params };

    return this.http.get<JobSearchCompleteResponse>('https://jobsearch.api.jobtechdev.se/complete', options).pipe(
      map(value => {
        return value.typeahead
        .filter(value => {
          return value.type == 'skill'
        })
        .map(typeahead => { return typeahead.value })
      })
    )
  }

  convertJSSkillsToTXOccupations(skills: string[]): Observable<TaxonomyConcept[]> {
  
    let queryString = skills.map(skill => {
      return '+' + skill
    })
    let params = new HttpParams();

    params = params.append('q', queryString.join(" "))
    params = params.append('stats', 'occupation-name')
    params = params.append('limit', 0)

    const options = { params: params };

    return this.http.get<JobSearchResponse>('https://jobsearch.api.jobtechdev.se/search', options)
    .pipe(
      map(value => { return value.stats }),
      concatAll(),
      map(value => {
        return value.values.map(value => { 
          return new TaxonomyConcept(value.concept_id, "occupation-name", value.term)
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