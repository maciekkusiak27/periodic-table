import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PeriodicElement } from '../periodic-elements';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';

@Component({
  selector: 'app-periodic-table',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './periodic-table.component.html',
  styleUrls: ['./periodic-table.component.scss'],
})
export class PeriodicTableComponent implements OnInit {
  displayedColumns: string[] = [
    'position',
    'name',
    'weight',
    'symbol',
    'actions',
  ];
  dataSource = new MatTableDataSource<PeriodicElement>();

  filterValue: string = '';
  timeout: ReturnType<typeof setTimeout> | null = null;

  private dataUrl =
    'https://raw.githubusercontent.com/maciekkusiak27/periodic-table/main/src/app/data/data.json';

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  public ngOnInit() {
    this._fetchData().subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  private _fetchData(): Observable<PeriodicElement[]> {
    return this.http
      .get<PeriodicElement[]>(this.dataUrl)
      .pipe(map((data) => data));
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    clearTimeout(this.timeout ?? undefined);
    this.timeout = setTimeout(() => {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }, 2000);
  }

  public edit(element: PeriodicElement): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '250px',
      data: { ...element },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.dataSource.data.findIndex(
          (e) => e.position === result.position
        );
        if (index !== -1) {
          this.dataSource.data[index] = result;
          this.dataSource._updateChangeSubscription();
        }
      }
    });
  }
}
