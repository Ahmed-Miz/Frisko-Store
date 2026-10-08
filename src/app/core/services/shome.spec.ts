import { TestBed } from '@angular/core/testing';

import { Shome } from './shome';

describe('Shome', () => {
  let service: Shome;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Shome);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
