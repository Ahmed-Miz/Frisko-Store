import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnLang } from './btn-lang';

describe('BtnLang', () => {
  let component: BtnLang;
  let fixture: ComponentFixture<BtnLang>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnLang]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnLang);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
