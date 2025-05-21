// ==========================================================>> Core Library
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


// ==========================================================>> Third Party Library
import { TranslocoModule } from '@ngneat/transloco';

// ==========================================================>> Custom Library

import { ScrollbarModule } from 'helpers/directives/scrollbar';
import { SharedModule } from 'app/shared/shared.module';
import { BarChartComponent } from './bar-chart/component';
import { SaleCicleChartComponent } from './cicle-chart-sale/component';
import { CicleChartComponent } from './cicle-chart/component';
import { SaleCashierBarChartComponent } from './bar-chart-sale/component';
import { DashboardComponent } from './component';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { UiSwitchModule } from 'ngx-ui-switch';


const dashboardRoutes: Routes = [
  {
      path: '',
      component: DashboardComponent,
  },
];

@NgModule({
    declarations: [
    //   DashboardComponent,

    ],
    imports: [
      ScrollbarModule,
      SharedModule,
      RouterModule.forChild(dashboardRoutes),
      TranslocoModule,
      SaleCicleChartComponent,
      BarChartComponent,
      CicleChartComponent,
      SaleCashierBarChartComponent,
      DashboardComponent,
      CommonModule,
      RouterModule,
      MatIconModule,
      MatButtonModule,
      NgClass,
      NgFor,
      NgIf,
      MatMenuModule,
      MatTabsModule,
      MatTableModule,
      MatCheckboxModule,
      UiSwitchModule,
      MatPaginatorModule,
      MatFormFieldModule,
      MatSelectModule,
      MatInputModule,
      ReactiveFormsModule,
      BarChartComponent,
      CicleChartComponent,
      MatDatepickerModule,
      MatNativeDateModule,
      SaleCashierBarChartComponent,
      SaleCicleChartComponent,
    ]
})
export class DashboardModule {}
