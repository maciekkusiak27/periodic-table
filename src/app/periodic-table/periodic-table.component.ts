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
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { RxState } from '@rx-angular/state';

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
  providers: [RxState],
})
export class PeriodicTableComponent implements OnInit {
  public displayedColumns: string[] = [
    'position',
    'name',
    'weight',
    'symbol',
    'actions',
  ];
  public dataSource = new MatTableDataSource<PeriodicElement>();

  private _timeout: ReturnType<typeof setTimeout> | null = null;

  private _dataUrl =
    'https://raw.githubusercontent.com/maciekkusiak27/periodic-table/main/src/app/data/data.json';

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private rxState: RxState<{
      data: PeriodicElement[];
      originalData: PeriodicElement[];
      filterValue: string;
    }>
  ) {}

  public ngOnInit() {
    this.rxState.set({ data: [], originalData: [], filterValue: '' });
    this._loadData();

    this.rxState.select('data').subscribe((filteredData) => {
      this.dataSource.data = filteredData;
    });
  }

  private _loadData() {
    this.rxState.connect(
      this.http.get<PeriodicElement[]>(this._dataUrl),
      (state, data) => ({
        originalData: data,
        data,
      })
    );
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    clearTimeout(this._timeout ?? undefined);
    this._timeout = setTimeout(() => {
      this.rxState.set(({ originalData }) => {
        const filteredData = originalData.filter((element) =>
          element.name.toLowerCase().includes(filterValue)
        );
        return { data: filteredData, filterValue };
      });
    }, 2000);
  }

  public edit(element: PeriodicElement): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '250px',
      data: { ...element },
    });

    this.rxState.hold(dialogRef.afterClosed(), (result) => {
      if (result) {
        this.rxState.set(({ originalData, filterValue }) => {
          const updatedData = originalData.map((item) =>
            item.position === result.position ? result : item
          );

          const filteredData = updatedData.filter((item) =>
            item.name.toLowerCase().includes(filterValue)
          );

          return { data: filteredData, originalData: updatedData };
        });
      }
    });
  }
}
