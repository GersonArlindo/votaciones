import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeerQrComponent } from './leer-qr.component';

describe('LeerQrComponent', () => {
  let component: LeerQrComponent;
  let fixture: ComponentFixture<LeerQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeerQrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeerQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
