import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannellingComponent } from './channelling.component';

describe('ChannellingComponent', () => {
  let component: ChannellingComponent;
  let fixture: ComponentFixture<ChannellingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannellingComponent ]
    })
    .compileComponents();
  })); 

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannellingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
