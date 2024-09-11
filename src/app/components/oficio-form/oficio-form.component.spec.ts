import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OficioFormComponent } from './oficio-form.component';

describe('OficioFormComponent', () => {
  let component: OficioFormComponent;
  let fixture: ComponentFixture<OficioFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OficioFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OficioFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
