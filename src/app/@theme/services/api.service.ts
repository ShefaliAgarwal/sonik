import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';


@Injectable()
export class ApiService {
    uri = '';
    private api = environment.api;
    constructor(private http: HttpClient) { }

    public getJsonOptions() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        };
        return httpOptions;
    }

    public setOptions(body: any) {
        const options = {
            headers: this.getHeaders(),
            body: body,
        };
        return options;
    }

    public getParams(body: any): any {
        let params = new HttpParams();

        // Begin assigning parameters
        if (body.segment != undefined) {
            params = params.append('segment', body.segment);
        }
        params = params.append('start_date', body.start_date);
        params = params.append('end_date', body.end_date);
        if (body.channel_type != undefined) {
            params = params.append('channel_type', body.channel_type);
        }
        if (body.engagement_metric != undefined) {
            params = params.append('engagement_metric', body.engagement_metric);
        }
        if (body.dimension != undefined) {
            params = params.append('dimension', body.dimension);
        }
        return params;
    }

    public getBarChartParams(body: any): any {
        let params = new HttpParams();

        // Begin assigning parameters
        if (body.segment != undefined) {
            params = params.append('segment', body.segment);
        } params = params.append('start_date', body.start_date);
        params = params.append('end_date', body.end_date);
        if (body.channel_type != undefined) {
            params = params.append('channel_type', body.channel_type);
        }
        params = params.append('size', body.size);
        params = params.append('dimension', body.dimension);

        return params;
    }
    public getLineChartParams(body: any): any {
        let params = new HttpParams();

        // Begin assigning parameters
        if (body.segment != undefined) {
            params = params.append('segment', body.segment);
        }
        params = params.append('start_date', body.start_date);
        params = params.append('end_date', body.end_date);
        if (body.channel_type != undefined) {
            params = params.append('channel_type', body.channel_type);
        }
        params = params.append('size', body.size);
        params = params.append('dimension', body.dimension);
        params = params.append('metric', body.metric);

        return params;
    }

    public getMapParams(body: any): any {
        let params = new HttpParams();

        // Begin assigning parameters
        if (body.segment != undefined) {
            params = params.append('segment', body.segment);
        } params = params.append('start_date', body.start_date);
        params = params.append('end_date', body.end_date);
        if (body.channel_type != undefined) {
            params = params.append('channel_type', body.channel_type);
        }
        params = params.append('dimension', body.dimension);

        return params;
    }
    public setFilterParams(body: any): any {
        let params = new HttpParams();
        params = params.append('name', body.name);
        return params;
    }

    public getTableParams(body: any): any {
        let params = new HttpParams();

        // Begin assigning parameters
        if (body.segment != undefined) {
            params = params.append('segment', body.segment);
        } params = params.append('start_date', body.start_date);
        params = params.append('end_date', body.end_date);
        if (body.channel_type != undefined) {
            params = params.append('channel_type', body.channel_type);
        }
        params = params.append('size', body.size);
        params = params.append('dimension', body.dimension);
        params = params.append('column', body.column);

        return params;
    }
    /**
         * @name extractData
         * @function extracts the data from the response
         * @returns response
         * @param response from the server
         */

    public extractData(res: Response) {
        const body = res;
        return body || {};
    }

    public apiCaller(type: string, url: string, data?: any): any {
        this.uri = this.api + url;
        if (type === 'get') {
            if (data) {
                return this.get(this.uri, data);
            } else {
                return this.get(this.uri);
            }

        } else if (type === 'delete') {
            return this.delete(this.uri);
        } else {
            return this.post(this.uri, data);
        }

    }
    private post(url: string, data: any): any {
        return this.http.post(url, data, { headers: this.getHeaders() });
    }
    private delete(url: string): any {
        return this.http.delete(url, { headers: this.getHeaders() });
    }
    private get(url: string, body?: any): any {
        if (body) {
            return this.http.get(url, { params: body });

        } else {
            return this.http.get(url, { headers: this.getHeaders() });
        }
    }
    private getHeaders(): HttpHeaders {
        const headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Origin', '*');
        return headers;
    }
}
