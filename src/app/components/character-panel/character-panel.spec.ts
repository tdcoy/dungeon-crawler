import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterPanel } from './character-panel';

describe('CharacterPanel', () => {
  let component: CharacterPanel;
  let fixture: ComponentFixture<CharacterPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(CharacterPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
