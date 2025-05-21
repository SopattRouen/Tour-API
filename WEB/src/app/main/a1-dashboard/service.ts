import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardResponse, DataSaleResponse } from './interface';
// Helper
// ================================================================================>> Thrid Party Library
// RxJS
import { environment as env } from 'environments/environment';
@Injectable({ providedIn: 'root' })
export class DashbordService {

    constructor(private _httpClient: HttpClient) { }
    private httpOptions = {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
    }

    // Method call to api to get data
    getDashboardData(params?: { today?: string; yesterday?: string; thisWeek?: string; thisMonth?: string; threeMonthAgo?: string; sixMonthAgo?: string,type?:number }): Observable<DashboardResponse> {
        let httpParams = new HttpParams();
        if (params) {
            if (params.today) httpParams = httpParams.set('filter', 'today');
            if (params.yesterday) httpParams = httpParams.set('filter', 'yesterday');
            if (params.thisWeek) httpParams = httpParams.set('filter', 'thisWeek');
            if (params.thisMonth) httpParams = httpParams.set('filter','thisMonth');
            if (params.threeMonthAgo) httpParams = httpParams.set('filter', 'threeMonthAgo');
            if (params.sixMonthAgo) httpParams = httpParams.set('filter', 'sixMonthAgo');
            if (params.type) httpParams = httpParams.set('type', params.type.toString());

        }
        // console.log('httpParams',params);
        return this._httpClient.get<DashboardResponse>(`${env.API_BASE_URL}/admin/dashboard`, { params: httpParams });
    }
    // getDashboardInfo(): any {

    //     return this._http.get(this._API_BASE_URL + '/admin/dashboard', {
    //         headers: new HttpHeaders().set('Content-Type', 'application/json'),
    //     });

    // }

    // Method to fetch a list of products from the POS system
    getDataSaleReport(startDate?: string, endDate?: string): Observable<any> {
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('report_type', 'PDF')
            .set('endDate', endDate);
        return this._httpClient.get<DataSaleResponse>(`${env.API_BASE_URL}/admin/generate`, { params });
    }


    // Method to fetch a list of products from the POS system
    getDataCashierReport(startDate?: string, endDate?: string): Observable<any> {
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('report_type', 'PDF')
            .set('endDate', endDate);
        return this._httpClient.get<DataSaleResponse>(`${env.API_BASE_URL}/admin/generate`, { params });
    }


    // Method to fetch a list of products from the POS system
    getDataProductReport(startDate?: string, endDate?: string): Observable<any> {
        const params = new HttpParams()
            .set('startDate', startDate)
            .set('report_type', 'PDF')
            .set('endDate', endDate);
        return this._httpClient.get<DataSaleResponse>(`${env.API_BASE_URL}/admin/generate`, { params });
    }

}

