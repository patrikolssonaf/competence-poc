import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OccupationGroupPickerComponent } from './occupation-group-picker.component';

describe('OccupationGroupPickerComponent', () => {
  let component: OccupationGroupPickerComponent;
  let fixture: ComponentFixture<OccupationGroupPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OccupationGroupPickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OccupationGroupPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
