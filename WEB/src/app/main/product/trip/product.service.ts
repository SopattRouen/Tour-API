// ==========================================================>> Core Library
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// ==========================================================>> Custom Library
import { environment as env } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ProductsService {

    public url: string = env.API_BASE_URL;
    public httpOptions = {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
    };

    constructor(private http: HttpClient) { }

    /**
     |-------------------------------------------------------------------
     | Learn Create Read Update Delete (CRUD)
     |-------------------------------------------------------------------
     |
     | develop by: Yim Klok
     |
     */
    // ==================== Create One Product
    create(data: object = {}): any {
        return this.http.post(this.url + '/admin/trips', data, this.httpOptions);
    }

    //get setup data
    getSetUp(): any {
        const httpOptions = {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        };
        return this.http.get(this.url + '/admin/trips/setup', httpOptions);
    }

    // =================== Update One Product
    view(id: number=null): Observable<any> {
        console.log(id);

        const httpOptions = {};
        return this.http.get(this.url + '/admin/trips/' + id, httpOptions);
    }

    // ==================== Read All trips
    read(params = {}): any {
        const httpOptions = {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        };
        httpOptions['params'] = params;
        return this.http.get(this.url + '/admin/trips', httpOptions);
    }
    // =================== Update One Product
    update(id: number = 0, data: object = {}): any {
        return this.http.post(this.url + '/admin/trips/' + id, data, this.httpOptions);
    }
    // ==================== Delete One Product
    delete(id: number = 0): any {
        return this.http.delete(this.url + '/admin/trips/' + id, this.httpOptions);
    }
    //==================================================================transactions
    getTransactions(id: number = null, params = {}): Observable<any> {
        const httpOptions = {
          headers: new HttpHeaders().set('Content-Type', 'application/json'),
          params: params // Include additional parameters in the params object
        };

        return this.http.get(this.url + '/admin/trips/transactions/' + id, httpOptions);
      }

    //================================================================= Get trips type
    getProductType(): Observable<any> {
        const httpOptions = {
          headers: new HttpHeaders().set('Content-Type', 'application/json'),
        };

        return this.http.get(this.url + '/admin/trips/types' , httpOptions);
      }

}
