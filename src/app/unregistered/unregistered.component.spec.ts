import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UnregisteredComponent } from './unregistered.component';


describe('PageNotFoundComponent', () => {
  let component: UnregisteredComponent;
  let fixture: ComponentFixture<UnregisteredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnregisteredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnregisteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
