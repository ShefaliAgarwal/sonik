export class BarChartData {
    chartLabel: string[];
    data: number[][];
}

export class BarChartReq {
    segment: any;
    start_date: any;
    end_date: any;
    channel_type: any;
    size: any;
    dimension: any;
    constructor() {
        let date = new Date();
        let datee = new Date(date.getTime() - (7 * 24 * 60 * 60 * 1000));
        this.start_date = Math.round((Math.floor(datee.getTime()) / 1000));
        this.end_date = Math.round((Math.floor(date.getTime()) / 1000));
        this.segment = undefined;
        this.size = 5;
    }
}

export class LineChartData {
    chartLabel: string[];
    data: number[][];
}

export class LineChartReq {
    segment: any;
    start_date: any;
    end_date: any;
    channel_type: any;
    size: any;
    dimension: any;
    metric: any;
    constructor() {
        let date = new Date();
        let datee = new Date(date.getTime() - (7 * 24 * 60 * 60 * 1000));
        this.start_date = Math.round((Math.floor(datee.getTime()) / 1000));
        this.end_date = Math.round((Math.floor(date.getTime()) / 1000));
        this.segment = 'new_users';
        this.size = 5;
    }
}
