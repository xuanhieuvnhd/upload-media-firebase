import {Component, OnInit} from '@angular/core';
import {FileUpload} from '../../model/file-upload';
import {UploadFileService} from '../upload-file.service';

@Component({
  selector: 'app-form-upload',
  templateUrl: './form-upload.component.html',
  styleUrls: ['./form-upload.component.css']
})
export class FormUploadComponent implements OnInit {
  // @ts-ignore
  selectedFiles: FileList;
  // @ts-ignore
  currentFileUpload: FileUpload;
  // @ts-ignore
  percentage: number;

  constructor(private uploadService: UploadFileService) {
  }

  ngOnInit(): void {
  }

  selectFile(event: Event) {
    // @ts-ignore
    this.selectedFiles = event.target.files;
  }

  upload() {
    const file = this.selectedFiles.item(0);
    // @ts-ignore
    this.selectedFiles = undefined;
    // @ts-ignore
    this.currentFileUpload = new FileUpload(file);
    this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(
      percentage => {
        this.percentage = Math.round(percentage);
      },
      error => {
        console.log(error);
      }
    );
  }
}
