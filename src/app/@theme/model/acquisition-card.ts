export class CardReqObj {
    segment: any;
    start_date: any;
    end_date: any;
    channel_type: any;
    constructor() {
        let date = new Date();
        let datee = new Date(date.getTime() - (7 * 24 * 60 * 60 * 1000));
        this.start_date = Math.round((Math.floor(datee.getTime()) / 1000));
        this.end_date = Math.round((Math.floor(date.getTime()) / 1000));
        this.segment = undefined;
    }
}

export class CardResponseObj {
    title: any;
    count: any;
    percentage: any;
    increment: boolean;
    text: any;
    constructor() {
        this.title = '';
        this.count = 0;
        this.percentage = 0;
        this.increment = false;
        this.text = '';
    }
}
