import { TestBed } from '@angular/core/testing';
import { PseudoService } from './pseudo.service';
import { COMMENT_RULES } from '../game/scenes/guestBookHouse/comment-rules';

describe('PseudoService', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.resetTestingModule();
  });

  it('starts empty, or with the pseudo kept for the tab session', () => {
    expect(TestBed.inject(PseudoService).current()).toBe('');

    sessionStorage.setItem('pseudo', 'Marin');
    TestBed.resetTestingModule();
    expect(TestBed.inject(PseudoService).current()).toBe('Marin');
  });

  it('shares one value between every reader and keeps it for the tab session', () => {
    const service = TestBed.inject(PseudoService);
    service.set('Link');

    expect(TestBed.inject(PseudoService).pseudo()).toBe('Link');
    expect(sessionStorage.getItem('pseudo')).toBe('Link');
  });

  it('keeps the typed value but trims the one sent to the others', () => {
    const service = TestBed.inject(PseudoService);
    service.set('Link ');

    expect(service.pseudo()).toBe('Link ');
    expect(service.current()).toBe('Link');
  });

  it('cuts the pseudo to the guestbook limit', () => {
    const service = TestBed.inject(PseudoService);
    service.set('x'.repeat(COMMENT_RULES.PSEUDO_MAX_LENGTH + 10));

    expect(service.pseudo()).toHaveLength(COMMENT_RULES.PSEUDO_MAX_LENGTH);
  });
});
