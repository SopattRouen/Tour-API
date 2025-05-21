    // ==========================================================>> Core Library
    import { Component, EventEmitter, Inject, OnInit, ViewChild, Input, TemplateRef, SimpleChanges } from '@angular/core';
    import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
    import { Router, ActivatedRoute } from '@angular/router';
    import { MatTabGroup } from '@angular/material/tabs';

    // ==========================================================>> Third Party Library
    import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
    import { GlobalConstants } from 'app/shared/global-constants';


    // ==========================================================>> Custom Library
    import { SnackbarService } from 'app/shared/services/snackbar.service';
    import { ProductsService } from '../../product.service';
    import { environment as env } from 'environments/environment';
    import { LoadingService } from 'helpers/services/loading';
    import { ProductTypeService } from 'app/main/product/type/product-type.service';
    @Component({
        selector: 'app-overview',
        templateUrl: './overview.component.html',
        styleUrls: ['./overview.component.scss'],
    })
    export class OverViewComponent implements OnInit {
        @Input() public data: any;
        isLoading: boolean = false;
        public types: any = []; //
        form: UntypedFormGroup;
        public id: number;
        public FILE_PUBLIC_BASE_URL: string = env.FILE_PUBLIC_BASE_URL;
        public src: string = 'assets/icons/icon-img.png';
        public products_type: any = [];
        public saving: boolean = false;


        constructor(
            private _snackBar: SnackbarService,
            private _productService: ProductsService,
            private readonly _router: Router,
            private _route: ActivatedRoute,
            private _formBuilder: UntypedFormBuilder,
        ) { }

        ngOnInit(): void {
            this.buildForm();
            this.getProductType();
        }

        ngOnChanges(changes: SimpleChanges): void {
            if (changes.data && this.data) {
                this.src = this.FILE_PUBLIC_BASE_URL + this.data.image;
                this.buildForm();
            }
        }
    

        buildForm(): void {
            console.log('Data in buildForm:', this.data);

            if (this.data) {
                this.form = this._formBuilder.group({
                    title: [this.data.title],
                    city_id: [this.data.cities],
                    trip_days: [this.data.trip_days],
                    price: [this.data.price],
                    description: [this.data.description],
                    start_date: [this.data.start_date],
                    image:[this.data.image]
                });
            }
        }

        srcChange($event: any) {
            this.form.get('image').setValue($event);
        }

        submit(): void {
            if (this.form) {
                this.saving = true;

                this._productService.update(this.data.id, this.form.value).subscribe(
                    (res: any) => {
                        this.saving = false;
                        this._snackBar.openSnackBar(res.message, '');
                        this.form.enable();
                    },
                    (err: any) => {
                        // Re-enable the form
                        this.form.enable();

                        // Handle errors
                        this.saving = false;
                        let errors: any[] = [];
                        errors = err.error.errors;
                        let messages: any[] = [];
                        let text: string = '';
                        // ...
                        this._snackBar.openSnackBar(text, 'error');
                    }
                );
            } else {
                this._snackBar.openSnackBar(
                    'Please provide data',
                    GlobalConstants.error
                );
            }
        }
        // Modify the click event handler for the "X" button to back to previous page
        navigateBack(): void {
            this._router.navigate(['../../'], { relativeTo: this._route });
        }

        getProductType(): void {
            this._productService.getSetUp().subscribe(
              (res: any) => {
              this.types = res;
              console.log(res);
            },
          );
        }
    }
