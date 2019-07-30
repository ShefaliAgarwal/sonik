import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnGroundComponent } from './on-ground.component';

describe('OnGroundComponent', () => {
  let component: OnGroundComponent;
  let fixture: ComponentFixture<OnGroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnGroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnGroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
