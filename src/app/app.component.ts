import { Component } from '@angular/core';
import { PeriodicTableComponent } from './periodic-table/periodic-table.component';
import { ELEMENT_DATA } from './data/mockData';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PeriodicElement } from './periodic-elements';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PeriodicTableComponent, MatDialogModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'periodic-table-app';
  elements = ELEMENT_DATA;

  constructor(public dialog: MatDialog) {}

  public openEditDialog(element: PeriodicElement): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '250px',
      data: { ...element } 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._updateElement(result);
      }
    });
  }

  private _updateElement(updatedElement: PeriodicElement): void {
    const index = this.elements.findIndex(el => el.position === updatedElement.position);
    if (index !== -1) {
      this.elements = [...this.elements]; 
      this.elements[index] = updatedElement;
    }
  }
}
