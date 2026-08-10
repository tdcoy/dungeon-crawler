import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageLog } from './message-log';

describe('MessageLog', () => {
  let component: MessageLog;
  let fixture: ComponentFixture<MessageLog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageLog],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageLog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
