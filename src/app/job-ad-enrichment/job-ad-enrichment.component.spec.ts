import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobAdEnrichmentComponent } from './job-ad-enrichment.component';

describe('JobAdEnrichmentComponent', () => {
  let component: JobAdEnrichmentComponent;
  let fixture: ComponentFixture<JobAdEnrichmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobAdEnrichmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobAdEnrichmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
