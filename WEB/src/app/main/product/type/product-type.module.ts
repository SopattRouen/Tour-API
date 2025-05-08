// ==========================================================>> Core Library
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// ==========================================================>> Custom Library
import { SharedModule } from 'app/shared/shared.module';
import { ScrollbarModule } from 'helpers/directives/scrollbar';
import { ListingComponent } from './listing/listing.component';
import { ViewDialogComponent } from './view-dialog/view-dialog.component';
import { CreateComponent } from './create/create.component';


const routes: Routes = [
    {
        path: '',
        component: ListingComponent
    }
];

@NgModule({
    imports: [
        ScrollbarModule,
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        ListingComponent,
        ViewDialogComponent,
        CreateComponent
    ],
})
export class ProductTypeModule {}
