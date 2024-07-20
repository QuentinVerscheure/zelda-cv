import { TestBed } from '@angular/core/testing';

import { WallCollisionService } from './wall-collision.service';

describe('WallCollisionService', () => {
  let service: WallCollisionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WallCollisionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
