import { HttpClient } from '@angular/common/http';
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
