import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { EnrichDocument, EnrichDocumentRequest, OntologyItem, OntologyService } from '../ontology.service';
import { JobSearchAPIService, JobSearchResponse, JobSearchSearchRequest } from '../job-search-api.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-poc',
  templateUrl: './poc.component.html',
  styleUrls: ['./poc.component.css']
})
export class PocComponent {

  autocompleteControl = new FormControl('');
  autocompleteSkills: Observable<OntologyItem[]> | undefined;
  originSkill: OntologyItem | undefined
  jobsearchRequest: JobSearchSearchRequest | undefined
  jobSearchResult: JobSearchResult | undefined

  constructor(private jobsearch: JobSearchAPIService, private ontology: OntologyService) { }
  
  ngOnInit() {
    this.autocompleteSkills = this.autocompleteControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(value => {
        return this.ontology.getSuggestions(value ?? "")
      })
    );
  }

  clearOriginSkill() {
    this.autocompleteControl.setValue("")
  }

  setOriginSkill(event: MatAutocompleteSelectedEvent) {
    console.log(event);
    this.originSkill = event.option.value
    this.fetchJobAds()
  }
  
  displayOriginSkill(item: OntologyItem) {
    return item.term
  }

  fetchJobAds() {
    const request: JobSearchSearchRequest = {
      q: this.originSkill?.concept ?? "",
      limit: 10,
      stats: [],
      "stats.limit": 0
    }
    this.jobsearchRequest = request
    this.jobsearch.search(request).pipe(
      switchMap(response => {
        this.jobSearchResult = {
          totalHits: response.total.value,
          hits: response.hits.map(hit => {
            return {
              id: hit.id,
              headline: hit.headline,
              description: hit.description.text,
              skills: []
            }
          })
        }
        const doc: EnrichDocument[] = response.hits.map(hit => {
          return {
            doc_id: hit.id,
            doc_headline: hit.headline,
            doc_text: hit.description.text
          }
        })
        const request: EnrichDocumentRequest = {
          documents_input: doc,
          include_misspelled_synonyms: false,
          include_sentences: false,
          include_synonyms: false,
          include_terms_info: true
        }
        return this.ontology.getEnrichment(request)
      })
    ).subscribe(response => {
      this.jobSearchResult?.hits.forEach(hit => {
        let doc = response.find(item => {
          return item.doc_id == hit.id
        })
        hit.skills = doc?.enriched_candidates.competencies.map(competence => {
          const x: JobAdItemSkill =
          {
            concept_label: competence.concept_label,
            term: competence.term
          }
          return x
        }) ?? []
      })
    })
  }
}

interface JobSearchResult {
  totalHits: number
  hits: JobAdItem[]
}

interface JobAdItemSkill {
    concept_label: string
    term: string
}

interface JobAdItem {
  id: string
  headline: string
  description: string
  skills: JobAdItemSkill[]
}