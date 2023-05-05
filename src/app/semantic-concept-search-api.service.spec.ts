import { TestBed } from '@angular/core/testing';

import { SemanticConceptSearchAPIService } from './semantic-concept-search-api.service';

describe('SemanticConceptSearchAPIService', () => {
  let service: SemanticConceptSearchAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SemanticConceptSearchAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
