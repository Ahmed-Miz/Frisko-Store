import { TestBed } from '@angular/core/testing';

import { Sauth } from './sauth';

describe('Sauth', () => {
  let service: Sauth;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sauth);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
