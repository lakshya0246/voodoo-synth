import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlLabelComponent } from './control-label.component';

describe('ControlLabelComponent', () => {
  let component: ControlLabelComponent;
  let fixture: ComponentFixture<ControlLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlLabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
