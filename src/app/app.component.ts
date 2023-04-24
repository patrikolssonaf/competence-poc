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
  selectedOccupationGroup: TaxonomyConcept | undefined
  selectableSkills: SelectableTaxonomyConcept[] = []
  jobSearchSkills: string[] = []
  recomendedTaxOccupations: TaxonomyConcept[] = []
  jobsearchResponse: JobSearchResponse | undefined

  constructor(private taxonomy: TaxonomyService, private jobsearch: JobSearchAPIService) {}
  
  selectOccupationGroup(item: TaxonomyConcept) {
    this.selectedOccupationGroup = item
    this.taxonomy.skillLookup(item.id).subscribe(skills => {
      this.selectableSkills = skills.map(skill => {
        return new SelectableTaxonomyConcept(false, skill)
      })
    })  
  }

  selectSkill(change: MatChipSelectionChange, skill: SelectableTaxonomyConcept) {
    skill.selected = change.selected
    let concepts = this.selectableSkills.filter(skill => { return skill.selected }).map(value => { return value.concept })
    this.taxonomy.fetchJobSearchSkills(concepts).subscribe(skills => {
      this.jobSearchSkills = skills
    })

    const request: JobSearchSearchRequest = {
      q: "",
      limit: 10,
      stats: [],
      "stats.limit": 0,
      skills: concepts.map(concept => concept.id)
    }
    this.jobsearch.search(request).subscribe(respone => {
      this.jobsearchResponse = respone
    })
  }

  fetchOccupation() {
    this.taxonomy.convertJSSkillsToTXOccupations(this.jobSearchSkills).subscribe(concepts => {
      this.recomendedTaxOccupations = concepts
    })
  }
}

export class SelectableTaxonomyConcept {
  selected: boolean
  concept: TaxonomyConcept

  constructor(selected: boolean, concept: TaxonomyConcept) {
    this.selected = selected
    this.concept = concept
  }
}
