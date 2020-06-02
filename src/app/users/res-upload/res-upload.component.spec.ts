import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResUploadComponent } from './res-upload.component';

describe('ResUploadComponent', () => {
  let component: ResUploadComponent;
  let fixture: ComponentFixture<ResUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
