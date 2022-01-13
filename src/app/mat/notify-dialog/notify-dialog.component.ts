import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { NotifyDialogData } from 'src/app/interfaces/notify-dialog-data.system';

@Component({
  selector: 'app-notify-dialog',
  templateUrl: './notify-dialog.component.html',
  styleUrls: ['./notify-dialog.component.scss']
})
export class NotifyDialogComponent {

  constructor(public dialogRef: MatDialogRef<NotifyDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: NotifyDialogData) { }

  onClose(): void {
    this.dialogRef.close()
  }

}
