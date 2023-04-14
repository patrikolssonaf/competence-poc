import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OntologyComponent } from './ontology.component';

describe('OntologyComponent', () => {
  let component: OntologyComponent;
  let fixture: ComponentFixture<OntologyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OntologyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OntologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
