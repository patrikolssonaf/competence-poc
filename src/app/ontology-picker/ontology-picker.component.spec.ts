import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OntologyPickerComponent } from './ontology-picker.component';

describe('OntologyPickerComponent', () => {
  let component: OntologyPickerComponent;
  let fixture: ComponentFixture<OntologyPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OntologyPickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OntologyPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
