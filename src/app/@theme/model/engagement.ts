export class EngagementCardReqObj {
    start_date: any;
    end_date: any;
    channel_type: any;
    engagement_metric: any;
    constructor() {
        let date = new Date();
        let datee = new Date(date.getTime() - (7 * 24 * 60 * 60 * 1000));
        this.start_date = Math.round((Math.floor(datee.getTime()) / 1000));
        this.end_date = Math.round((Math.floor(date.getTime()) / 1000));
    }
}

export class EngagementCardResponseObj {
    title: any;
    count: any;
    percentage: any;
    increment: boolean;
    rate:boolean;
    constructor() {
        this.title = '';
        this.count = 0;
        this.percentage = 0;
        this.increment = false;
        this.rate = false;
    }
}

export class EngBarChartData {
    chartLabel: string[];
    data: number[][];
}

export class EngBarChartReq {
    start_date: any;
    end_date: any;
    segment: any;
    channel_type: any;
    engagement_metric: any;
    dimension: any;
    constructor() {
        let date = new Date();
        let datee = new Date(date.getTime() - (7 * 24 * 60 * 60 * 1000));
        this.start_date = Math.round((Math.floor(datee.getTime()) / 1000));
        this.end_date = Math.round((Math.floor(date.getTime()) / 1000));
        this.channel_type = undefined;
        this.segment = undefined;
    }
}

export class PieChartReq {
    start_date: any;
    end_date: any;
    channel_type: any;
    dimension: any;
    segment: any;
    constructor() {
        let date = new Date();
        let datee = new Date(date.getTime() - (7 * 24 * 60 * 60 * 1000));
        this.start_date = Math.round((Math.floor(datee.getTime()) / 1000));
        this.end_date = Math.round((Math.floor(date.getTime()) / 1000));
        this.channel_type = undefined;
        this.segment = undefined;
    }
}

export class PieChartData {
    chartLabel: string[];
    data: number[][];
}

export class EngagementTableReq {
    start_date: any;
    end_date: any;
    channel_type: any;
    dimension: any;
    segment: any;
    constructor() {
        let date = new Date();
        let datee = new Date(date.getTime() - (7 * 24 * 60 * 60 * 1000));
        this.start_date = Math.round((Math.floor(datee.getTime()) / 1000));
        this.end_date = Math.round((Math.floor(date.getTime()) / 1000));
        this.channel_type = undefined;
        this.segment = undefined;
    }
}