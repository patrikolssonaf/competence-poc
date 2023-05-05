import { Component } from '@angular/core';
import { TaxonomyConcept, TaxonomyService } from './taxonomy.service';
import { MatChipSelectionChange } from '@angular/material/chips';
import { JobSearchAPIService, JobSearchResponse, JobSearchSearchRequest } from './job-search-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CompetenceProfile';
  
}

export class SelectableTaxonomyConcept {
  selected: boolean
  concept: TaxonomyConcept

  constructor(selected: boolean, concept: TaxonomyConcept) {
    this.selected = selected
    this.concept = concept
  }
}
