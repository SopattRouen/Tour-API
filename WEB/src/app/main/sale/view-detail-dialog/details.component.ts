// ==========================================================>> Core Library
import { Component, Inject, OnInit } from '@angular/core';

// ==========================================================>> Third Party Library
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

// ==========================================================>> Custom Library
import { SaleService } from '../sale.service';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  public displayedColumns: string[] = ['no', 'product', 'price', 'qty', 'total'];
  public dataSource: any;
  public data: any[] = [];
  public isDownloading: boolean = false;

  public item: any[];
  constructor(

    @Inject(MAT_DIALOG_DATA) public getRow: any,
    private dialogRef: MatDialogRef<DetailsComponent>,
    private _saleService: SaleService

  ) {

    this.dialogRef.disableClose = true;

  }

  ngOnInit(): void {

    console.log(this.getRow);

    this.data = this.getRow?.details;
    this.dataSource = new MatTableDataSource(this.data);
  }

  print(): void {

    // Display Download UI
    this.isDownloading = true;

    // Call API for Base64 String
    this._saleService.print(this.getRow.receipt_number).subscribe((res: any) => {

        // Stop Download UI
        this.isDownloading = false;

        // Convert Base64 String to PDF
        const blob = this._saleService.b64toBlob(res.file_base64, 'application/pdf', '');

        // Save PDF to Local Machine (Download Folder)
        FileSaver.saveAs(blob, 'Invoice-' + this.getRow.receipt_number + '.pdf');

    }, (err: any) => {

        // Stop Download UI
        this.isDownloading = false;

    });

  }

  // =================================>> Convert base64 to blob
  // b64toBlob(b64Data: any, contentType: any, sliceSize: any) {
  //   contentType = contentType || '';
  //   sliceSize = sliceSize || 512;
  //   var byteCharacters = atob(b64Data);
  //   var byteArrays = [];
  //   for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
  //     var slice = byteCharacters.slice(offset, offset + sliceSize);
  //     var byteNumbers = new Array(slice.length);
  //     for (var i = 0; i < slice.length; i++) {
  //       byteNumbers[i] = slice.charCodeAt(i);
  //     }
  //     var byteArray = new Uint8Array(byteNumbers);
  //     byteArrays.push(byteArray);
  //   }
  //   var blob = new Blob(byteArrays, { type: contentType });
  //   return blob;
  // }

}
