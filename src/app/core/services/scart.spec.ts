import { TestBed } from '@angular/core/testing';

import { Scart } from './scart';

describe('Scart', () => {
  let service: Scart;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Scart);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
