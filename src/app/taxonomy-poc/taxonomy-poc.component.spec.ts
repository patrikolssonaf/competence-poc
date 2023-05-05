import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxonomyPOCComponent } from './taxonomy-poc.component';

describe('TaxonomyPOCComponent', () => {
  let component: TaxonomyPOCComponent;
  let fixture: ComponentFixture<TaxonomyPOCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxonomyPOCComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxonomyPOCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
