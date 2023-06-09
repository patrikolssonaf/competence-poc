import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { TaxonomyConcept } from './taxonomy.service';

@Injectable({
  providedIn: 'root'
})
export class JobSearchAPIService {

  constructor(private http: HttpClient) { }

  complete(request: JobSearchCompleteRequest): Observable<JobSearchCompleteResponse> {
  
    let params = new HttpParams();

    if (request.q.length > 1) {
      params = params.append('q', request.q)
    }

    request.qfields.forEach(field => {
      params = params.append(`qfields`, field);
    })

    const options = { params: params };

    return this.http.get<JobSearchCompleteResponse>('https://jobsearch.api.jobtechdev.se/complete', options)
  }

  search(request: JobSearchSearchRequest): Observable<JobSearchResponse> {
    let params = new HttpParams();

    if (request.q.length > 1) {
      params = params.append('q', request.q)
    }
    if (request['stats.limit'] >= 1) {
      params = params.append('stats.limit', request['stats.limit'])
    }
    request.stats.forEach(field => {
      params = params.append(`stats`, field);
    })

    request.skills.forEach(skill => {
      params = params.append(`skill`, skill);
    })

    const options = { params: params };
    return this.http.get<JobSearchResponse>('https://jobsearch.api.jobtechdev.se/search', options)      
  }

}

export interface JobSearchSearchRequest {
  q: string,
  stats: string[]
  'stats.limit': number
  limit: number
  skills: string[]
}

export interface JobSearchResponse {
  total: {
    value: number
  }
  stats: [
    {
      values: [
        {
          term: string
          concept_id: string
        }
      ]
    }
  ]
  hits: [
    {
      id: string
      headline: string
      description: {
        text: string
      }
      must_have: {
        skills: [{
          weight: number
          concept_id: string
          label: string
        }]
      }
      nice_to_have: {
        skills: [{
          weight: number
          concept_id: string
          label: string
        }]
      }
    }
  ]
}

export interface JobSearchCompleteRequest {
  q: string,
  qfields: string[]
}

export interface JobSearchCompleteTypeAhead {
  value: string
  type: string
}

export interface JobSearchCompleteResponse {
  typeahead: JobSearchCompleteTypeAhead[]
}