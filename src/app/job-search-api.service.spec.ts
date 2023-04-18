import { TestBed } from '@angular/core/testing';

import { JobSearchAPIService } from './job-search-api.service';

describe('JobSearchAPIService', () => {
  let service: JobSearchAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobSearchAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
