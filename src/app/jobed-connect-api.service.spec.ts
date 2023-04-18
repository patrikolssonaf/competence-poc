import { TestBed } from '@angular/core/testing';

import { JobedConnectAPIService } from './jobed-connect-api.service';

describe('JobedConnectAPIService', () => {
  let service: JobedConnectAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobedConnectAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
