import {Component, Input, OnInit} from '@angular/core';
import {FileUpload} from '../../model/file-upload';
import {UploadFileService} from '../upload-file.service';

@Component({
  selector: 'app-details-upload',
  templateUrl: './details-upload.component.html',
  styleUrls: ['./details-upload.component.css']
})
export class DetailsUploadComponent implements OnInit {

  @Input()
  fileUpload!: FileUpload;

  constructor(private uploadService: UploadFileService) {
  }

  ngOnInit(): void {
  }

  deleteFileUpload(fileUpload: FileUpload) {
    this.uploadService.deleteFileUpload(fileUpload);
  }

}
