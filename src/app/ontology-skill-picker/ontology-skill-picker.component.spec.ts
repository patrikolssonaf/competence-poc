import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OntologySkillPickerComponent } from './ontology-skill-picker.component';

describe('OntologySkillPickerComponent', () => {
  let component: OntologySkillPickerComponent;
  let fixture: ComponentFixture<OntologySkillPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OntologySkillPickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OntologySkillPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
