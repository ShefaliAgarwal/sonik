import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceMediumComponent } from './source-medium.component';

describe('SourceMediumComponent', () => {
  let component: SourceMediumComponent;
  let fixture: ComponentFixture<SourceMediumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SourceMediumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceMediumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
