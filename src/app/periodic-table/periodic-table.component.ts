import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PeriodicElement } from '../periodic-elements';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon'; 
import { MatInputModule } from '@angular/material/input';

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
    MatIconModule
  ],
  templateUrl: './periodic-table.component.html',
  styleUrls: ['./periodic-table.component.scss'],
})
export class PeriodicTableComponent implements OnChanges {
  @Input() elements: PeriodicElement[] = [];
  @Output() editElement = new EventEmitter<PeriodicElement>();

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'actions'];
  dataSource: MatTableDataSource<PeriodicElement> = new MatTableDataSource();

  filterValue: string = '';
  timeout: any = null;

  public ngOnChanges() {
    this.dataSource.data = this.elements;
    this.dataSource.filterPredicate = (data: PeriodicElement, filter: string) => {
      const filterText = filter.trim().toLowerCase();
      return (
        data.name.toLowerCase().includes(filterText) ||
        data.symbol.toLowerCase().includes(filterText) ||
        data.position.toString().includes(filterText) ||
        data.weight.toString().includes(filterText)
      );
    };
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    clearTimeout(this.timeout);  
    this.timeout = setTimeout(() => {
      this.dataSource.filter = filterValue.trim().toLowerCase();  
    }, 2000);
  }

  public edit(element: PeriodicElement): void {
    this.editElement.emit(element);
  }
}
