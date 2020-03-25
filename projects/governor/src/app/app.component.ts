import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'shared-lib';
import { MainFormDialogComponent } from './components/dialogs/main-form-dialog/main-form-dialog.component';

@Component({
  selector: 'ce-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private dialog: MatDialog,
    private message: MessageService
  ) { }

  // Custom public methods

  onAdd() {
    const dialogRef = this.dialog.open(MainFormDialogComponent, {
      disableClose: true,
      maxWidth: '90%',
      minWidth: '475px',
      width: '800px'
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.message.genericSaveMessage();
        }
      });
  }
}
