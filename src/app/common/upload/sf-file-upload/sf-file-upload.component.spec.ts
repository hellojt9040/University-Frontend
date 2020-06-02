import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SfFileUploadComponent } from './sf-file-upload.component';

describe('SfFileUploadComponent', () => {
  let component: SfFileUploadComponent;
  let fixture: ComponentFixture<SfFileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SfFileUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SfFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
