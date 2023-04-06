import { Component } from '@angular/core';
import { TaxonomyConcept, TaxonomyService } from './taxonomy.service';
import { MatChipSelectionChange } from '@angular/material/chips';

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

  constructor(private taxonomy: TaxonomyService) {}
  
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
