
// ================================================================================>> Core Library
import { AsyncPipe, CommonModule }              from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { RouterModule }             from '@angular/router';

// ================================================================================>> Thrid Party Library
// Material
import { MatAutocompleteModule }    from '@angular/material/autocomplete';
import { MatButtonModule }          from '@angular/material/button';
import { MatOptionModule }          from '@angular/material/core';
import { MatDatepickerModule }      from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule }         from '@angular/material/divider';
import { MatFormFieldModule }       from '@angular/material/form-field';
import { MatIconModule }            from '@angular/material/icon';
import { MatInputModule }           from '@angular/material/input';
import { MatMenuModule }            from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule }           from '@angular/material/radio';
import { MatSelectModule }          from '@angular/material/select';
import { MatTooltipModule }         from '@angular/material/tooltip';

import { HttpErrorResponse }        from '@angular/common/http';

import FileSaver                    from 'file-saver';

import { Subject }                  from 'rxjs';
import { DashbordService }          from '../../service';
import { GlobalConstants } from 'app/shared/global-constants';
import { PortraitComponent } from 'app/shared/portrait/portrait.component';
import { SnackbarService } from 'app/shared/services/snackbar.service';
import { format } from 'date-fns/format';
@Component({
    selector: 'app-report-generate',
    templateUrl: './template.html',
    styleUrls: ['./style.scss'],
    standalone: true,
    imports: [
        RouterModule,
        FormsModule,
        MatIconModule,
        CommonModule,
        MatTooltipModule,
        AsyncPipe,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatButtonModule,
        MatMenuModule,
        MatDividerModule,
        MatRadioModule,
        MatDialogModule,
        // PortraitComponent
    ]
})
export class ReportGenerateComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    saving: boolean = false;
    filterForm: UntypedFormGroup;

    public dateType = [
        { id: 'today', name: 'ថ្ងៃនេះ', showDate: '' },
        { id: 'thisWeek', name: 'សប្តាហ៍នេះ', showDate: '' },
        { id: 'thisMonth', name: 'ខែនេះ', showDate: '' },
        { id: '3MonthAgo', name: '3 ខែមុន', showDate: '' },
        { id: '6MonthAgo', name: '6 ខែមុន', showDate: '' },
        { id: 'startandend', name: 'ជ្រើសរើសអំឡុងពេល', showDate: '' }
    ];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { type: number },
        private dialogRef: MatDialogRef<ReportGenerateComponent>,
        private formBuilder: UntypedFormBuilder,
        private snackBarService: SnackbarService,
        private _service: DashbordService
    ) { }

    // ===> onInit method to initialize the component
    ngOnInit(): void {
        this.ngBuilderForm();
        this.updateShowDate();
        this.handleTimeTypeChanges();
    }


    // ===> Method to initialize the form
    ngBuilderForm(): void {
        const today = this.getTodayInCambodia();
        this.filterForm = this.formBuilder.group({
            timeType: ['today'], // Default to 'today'
            startDate: [{ value: today, disabled: true }, Validators.required],
            endDate: [{ value: today, disabled: true }, Validators.required]
        });
    }


    // ===> Method to handle the timeType changes
    handleTimeTypeChanges(): void {
        this.filterForm.get('timeType')!.valueChanges.subscribe((value) => {
            this.updateShowDate();

            if (value === 'startandend') {
                this.filterForm.get('startDate')!.enable();
                this.filterForm.get('endDate')!.enable();
            } else {
                const { startDate, endDate } = this.calculateDateRange(value);
                this.filterForm.patchValue({ startDate, endDate });

                this.filterForm.get('startDate')!.disable();
                this.filterForm.get('endDate')!.disable();
            }
        });
    }

    // ===> Method to update the showDate property of each dateType
    updateShowDate(): void {
        this.dateType.forEach((type) => {
            type.showDate = this.getDisplayDate(type.id);
        });
    }


    // ===> Method to get the display date
    getDisplayDate(type: string): string {
        const now = new Date();
        //const formatDate = (date: Date) => date.toISOString().split('T')[0];
        const formatDate = (date: Date): string => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        };
        if (type === 'today') {
            return `( ${formatDate(now)} )`;
        }

        if (type === 'startandend') {
            return;
        }

        const { startDate, endDate } = this.calculateDateRange(type);
        return `(${formatDate(startDate)} - ${formatDate(endDate)})`;
    }


    // ===> Method to calculate the date range
    calculateDateRange(type: string): { startDate: Date; endDate: Date } {
        const now = new Date();
        let startDate = new Date();
        let endDate = new Date();

        switch (type) {
            case 'today':
                startDate = endDate = this.getTodayInCambodia();
                break;

            case 'thisWeek':
                const diffToMonday = (now.getDay() - 1 + 7) % 7;
                startDate = new Date(now);
                startDate.setDate(now.getDate() - diffToMonday);
                startDate.setHours(0, 0, 0, 0);

                endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 6);
                endDate.setHours(23, 59, 59, 999);
                break;

            case 'thisMonth':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                startDate.setHours(0, 0, 0, 0);

                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                endDate.setHours(23, 59, 59, 999);
                break;

            case '3MonthAgo':
                const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                startDate = new Date(threeMonthsAgo);
                startDate.setHours(0, 0, 0, 0);

                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                endDate.setHours(23, 59, 59, 999);
                break;

            case '6MonthAgo':
                const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
                startDate = new Date(sixMonthsAgo);
                startDate.setHours(0, 0, 0, 0);

                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                endDate.setHours(23, 59, 59, 999);
                break;
        }

        return { startDate, endDate };
    }

    // ===> Method to submit the form
    // submit(): void {
    //     if (this.filterForm.valid) {
    //         const formValue = this.filterForm.value;
    //         let { startDate, endDate } = formValue;

    //         // If a predefined timeType is selected, calculate the dates
    //         if (formValue.timeType !== 'startandend') {
    //             const { startDate: calculatedStart, endDate: calculatedEnd } = this.calculateDateRange(formValue.timeType);
    //             startDate = calculatedStart;
    //             endDate = calculatedEnd;
    //         }
    //         // Call the service with formatted startDate and endDate
    //         this.saving = true;
    //         if (this.data.type === 1) {
    //             console.log(this.formatDate(startDate), this.formatDate(endDate))
    //             this._service.getDataSaleReport(this.formatDate(startDate), this.formatDate(endDate)).subscribe({
    //                 next: (response) => {
    //                     this.dialogRef.close();
    //                     this.saving = false;
    //                     const blob = this.b64toBlob(response.data, 'application/pdf');
    //                     FileSaver.saveAs(blob, `របាយការណ៍លក់រាយ(${this.getFormattedDateTime()}).pdf`);
    //                     this.snackBarService.openSnackBar('របាយការណ៍ទាញយកបានជោគជ័យ', 'success');
    //                 },
    //                 error: (err: HttpErrorResponse) => {
    //                     this.dialogRef.disableClose = false;
    //                     this.saving = false;
    //                     const errors = err.error?.errors;
    //                     let message = err.error?.message ?? GlobalConstants.genericError;
    //                     if (errors && errors.length > 0) {
    //                         message = errors.map((obj) => obj.message).join(', ');
    //                     }
    //                     this.snackBarService.openSnackBar(message, GlobalConstants.error);
    //                 }
    //             });
    //         }
    //         else if (this.data.type === 2) {
    //             this._service.getDataCashierReport(this.formatDate(startDate), this.formatDate(endDate)).subscribe({
    //                 next: (response) => {
    //                     // Close the dialog
    //                     this.dialogRef.close();

    //                     this.saving = false;
    //                     let blob = this.b64toBlob(response.data, 'application/pdf');
    //                     FileSaver.saveAs(blob, `របាយការណ៍លក់តាមអ្នក គិតប្រាក់(${this.getFormattedDateTime()}).pdf`);
    //                     // Show a success message using the snackBarService
    //                     this.snackBarService.openSnackBar('របាយការណ៍ទាញយកបានជោគជ័យ', 'Success');
    //                 },
    //                 error: (err: HttpErrorResponse) => {
    //                     // Re-enable closing the dialog in case of an error
    //                     this.dialogRef.disableClose = false;
    //                     // Set saving to false to indicate the operation is completed (even if it failed)
    //                     this.saving = false;
    //                     // Extract error information from the response
    //                     const errors: { type: string; message: string }[] | undefined = err.error?.errors;
    //                     let message: string = err.error?.message ?? GlobalConstants.genericError;

    //                     // If there are field-specific errors, join them into a single message
    //                     if (errors && errors.length > 0) {
    //                         message = errors.map((obj) => obj.message).join(', ');
    //                     }
    //                     // Show an error message using the snackBarService
    //                     this.snackBarService.openSnackBar(message, GlobalConstants.error);
    //                 },
    //             });
    //         } else {
    //             this._service.getDataProductReport(this.formatDate(startDate), this.formatDate(endDate)).subscribe({
    //                 next: (response) => {
    //                     // Close the dialog
    //                     this.dialogRef.close();

    //                     this.saving = false;
    //                     let blob = this.b64toBlob(response.data, 'application/pdf');
    //                     FileSaver.saveAs(blob, `របាយការណ៍លក់តាមផលិតផល(${this.getFormattedDateTime()}).pdf`);
    //                     // Show a success message using the snackBarService
    //                     this.snackBarService.openSnackBar('របាយការណ៍ទាញយកបានជោគជ័យ', 'success');
    //                 },
    //                 error: (err: HttpErrorResponse) => {
    //                     // Re-enable closing the dialog in case of an error
    //                     this.dialogRef.disableClose = false;
    //                     // Set saving to false to indicate the operation is completed (even if it failed)
    //                     this.saving = false;
    //                     // Extract error information from the response
    //                     const errors: { type: string; message: string }[] | undefined = err.error?.errors;
    //                     let message: string = err.error?.message ?? GlobalConstants.genericError;

    //                     // If there are field-specific errors, join them into a single message
    //                     if (errors && errors.length > 0) {
    //                         message = errors.map((obj) => obj.message).join(', ');
    //                     }
    //                     // Show an error message using the snackBarService
    //                     this.snackBarService.openSnackBar(message, GlobalConstants.error);
    //                 },
    //             });
    //         }
    //     } else {
    //         this.snackBarService.openSnackBar('Please fill in the required fields.', 'Error');
    //     }
    // }
    submit(): void {
        if (!this.filterForm.valid) {
            this.snackBarService.openSnackBar('Please fill in the required fields.', 'Error');
            return;
        }
    
        const formValue = this.filterForm.value;
        let { startDate, endDate, timeType } = formValue;
    
        if (timeType !== 'startandend') {
            const calculated = this.calculateDateRange(timeType);
            startDate = calculated.startDate;
            endDate = calculated.endDate;
        }
    
        this.saving = true;
        const formattedStart = this.formatDate(startDate);
        const formattedEnd = this.formatDate(endDate);
    
        let report$;
    
        if (this.data.type === 1) {
            report$ = this._service.getDataSaleReport(formattedStart, formattedEnd);
        } else if (this.data.type === 2) {
            report$ = this._service.getDataCashierReport(formattedStart, formattedEnd);
        } else {
            report$ = this._service.getDataProductReport(formattedStart, formattedEnd);
        }
    
        report$.subscribe({
            next: (response) => {
                this.dialogRef.close();
                this.saving = false;
    
                const base64 = this.cleanBase64(response.file_base64); // ✅ Use correct key
                const blob = this.b64toBlob(base64, 'application/pdf');
                FileSaver.saveAs(blob, 'report.pdf');
                // const filename = this.getReportFilename();
    
                // FileSaver.saveAs(blob, filename);
                this.snackBarService.openSnackBar('របាយការណ៍ទាញយកបានជោគជ័យ', 'success');
            },
            error: (err: HttpErrorResponse) => {
                this.dialogRef.disableClose = false;
                this.saving = false;
    
                const errors = err.error?.errors;
                let message = err.error?.message ?? GlobalConstants.genericError;
    
                if (errors?.length) {
                    message = errors.map(obj => obj.message).join(', ');
                }
    
                this.snackBarService.openSnackBar(message, GlobalConstants.error);
            }
        });
    }
    // Removes "data:application/pdf;base64," prefix if present
cleanBase64(base64: string): string {
    if (base64.startsWith('data:')) {
        return base64.split(',')[1];
    }
    return base64.trim();
}

    

    // ===> Method to format the date
    formatDate(date: Date | string): string {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    }


    // ===> Method to get the formatted date and time
    getFormattedDateTime(): string {
        const now = new Date();

        const formattedDate = new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(now);

        const formattedTime = new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        }).format(now);

        return `${formattedDate} ${formattedTime}`;
    }
    // // =================================>> Convert base64 to blob
    // b64toBlob(b64Data: string, contentType: string, sliceSize?: number) {
    //     contentType = contentType || '';
    //     sliceSize = sliceSize || 512;
    //     var byteCharacters = atob(b64Data);
    //     var byteArrays = [];
    //     for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    //         var slice = byteCharacters.slice(offset, offset + sliceSize);
    //         var byteNumbers = new Array(slice.length);
    //         for (var i = 0; i < slice.length; i++) {
    //             byteNumbers[i] = slice.charCodeAt(i);
    //         }
    //         var byteArray = new Uint8Array(byteNumbers);
    //         byteArrays.push(byteArray);
    //     }
    //     var blob = new Blob(byteArrays, { type: contentType });
    //     return blob;
    // }
    b64toBlob(b64Data: string, contentType: string, sliceSize: number = 512): Blob {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
    
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
    
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
    
            byteArrays.push(new Uint8Array(byteNumbers));
        }
    
        return new Blob(byteArrays, { type: contentType });
    }
    getReportFilename(): string {
        const prefix = this.data.type === 1
            ? 'របាយការណ៍លក់រាយ'
            : this.data.type === 2
            ? 'របាយការណ៍លក់តាមអ្នក គិតប្រាក់'
            : 'របាយការណ៍លក់តាមផលិតផល';
    
        return `${prefix}(${this.getFormattedDateTime()}).pdf`;
    }
    

    // ===> Method to get today's date in Cambodia timezone
    getTodayInCambodia(): Date {
        const now = new Date();
        const timeZone = 'Asia/Phnom_Penh';
        const formattedDate = format(now, 'yyyy-MM-dd', {  });
        return new Date(formattedDate);
    }

    // ===> Method to get the display date
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // ===> Method to close the dialog
    closeDialog(): void {
        this.dialogRef.close();
    }
}

