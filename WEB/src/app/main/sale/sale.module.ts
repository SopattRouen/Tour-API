// ==========================================================>> Core Library
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// ==========================================================>> Custom Library
import { SharedModule } from 'app/shared/shared.module';
import { ScrollbarModule } from 'helpers/directives/scrollbar';

import { ListingComponent } from './listing/listing.component';
import { DetailsComponent } from './view-detail-dialog/details.component';

const saleRoutes: Routes = [
    {
        path: 'xyz',
        component: ListingComponent
    }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(saleRoutes),
        ScrollbarModule
    ],
    declarations: [
        ListingComponent,
        DetailsComponent
    ],
})
export class SaleModule { }
