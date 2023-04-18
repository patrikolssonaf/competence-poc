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