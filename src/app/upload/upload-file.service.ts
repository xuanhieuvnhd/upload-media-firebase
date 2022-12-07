import {Injectable} from '@angular/core';
import {FileUpload} from '../model/file-upload';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {AngularFireDatabase, AngularFireList} from "@angular/fire/compat/database";
import {AngularFireStorage} from "@angular/fire/compat/storage";

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  private basePath = '/uploads';

  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage) {
  }

  pushFileToStorage(fileUpload: FileUpload): Observable<number> {
    const filePath = `${this.basePath}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          console.log('File available at', downloadURL);
          fileUpload.url = downloadURL;
          fileUpload.name = fileUpload.file.name;
          this.saveFileData(fileUpload);
        });
      })
    ).subscribe();
    // @ts-ignore
    return uploadTask.percentageChanges();
  }

  private saveFileData(fileUpload: FileUpload) {
    this.db.list(this.basePath).push(fileUpload);
  }

  getFileUpload(numberItems: number): AngularFireList<FileUpload> {
    return this.db.list(this.basePath, ref =>
      ref.limitToLast(numberItems));
  }

  deleteFileUpload(fileUpload: FileUpload) {
    this.deleteFileDatabase(fileUpload.key).then(() => {
      this.deleteFileStorage(fileUpload.name);
    }).catch(error => console.log(error));
  }

  private deleteFileDatabase(key: string | undefined) {
    return this.db.list(this.basePath).remove(key);
  }

  private deleteFileStorage(name: string | undefined) {
    const storageRef = this.storage.ref(this.basePath);
    if (name != null) {
      storageRef.child(name).delete();
    }
  }
}
