import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'shared-lib';
import { MainFormDialogComponent } from './components/dialogs/main-form-dialog/main-form-dialog.component';
import { MainTableService } from './services/main-table.service';

@Component({
  selector: 'sn-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  count = 0;

  constructor(
    private dialog: MatDialog,
    private message: MessageService,
    private mts: MainTableService
  ) {
    this.mts.countEvent.subscribe(count => this.count = count);
  }

  // Custom public methods

  onAdd() {
    if (this.count >= 4) {
      this.message.show('Sólo puedes agregar máximo 4 redes sociales.');

      return;
    }

    const dialogRef = this.dialog.open(MainFormDialogComponent, {
      data: {
        siblings: this.mts.getAll()
      },
      disableClose: true
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.message.genericSaveMessage();
        }
      });
  }
}
