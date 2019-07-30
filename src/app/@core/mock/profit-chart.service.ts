import { Injectable } from '@angular/core';
import { PeriodsService } from './periods.service';
import { ProfitChart, ProfitChartData } from '../data/profit-chart';
import { DashboardSampleService } from './dashboard-sample.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProfitChartService extends ProfitChartData {

  private year = [
    '2012',
    '2013',
    '2014',
    '2015',
    '2016',
    '2017',
    '2018',
  ];

  private data = { };
  private test: any;
  constructor(private period: PeriodsService, private http: HttpClient) {
    super();
    this.data = {
      week: this.getDataForWeekPeriod(),
      month: this.getDataForMonthPeriod(),
      year: this.getDataForYearPeriod(),
    };
    // this.data = {
    //   test: this.test,
    // };
  }

  private getDataForWeekPeriod(): ProfitChart {
    const nPoint = this.period.getWeeks().length;

    return {
      chartLabel: this.period.getWeeks(),
      data: [
        this.getRandomData(nPoint),
        this.getRandomData(nPoint),
        this.getRandomData(nPoint),
      ],
    };
  }

  // private getData(): any {
  //   this.http.get('./assets/data/dashboard-graph.json').subscribe(data => {
  //     this.test = data;
  //   });
  // }
  private getDataForMonthPeriod(): ProfitChart {
    const nPoint = this.period.getMonths().length;

    return {
      chartLabel: this.period.getMonths(),
      data: [
        this.getRandomData(nPoint),
        this.getRandomData(nPoint),
        this.getRandomData(nPoint),
      ],
    };
  }

  private getDataForYearPeriod(): ProfitChart {
    const nPoint = this.year.length;

    return {
      chartLabel: this.year,
      data: [
        this.getRandomData(nPoint),
        this.getRandomData(nPoint),
        this.getRandomData(nPoint),
      ],
    };
  }

  private getRandomData(nPoints: number): number[] {
    return Array.from(Array(nPoints)).map(() => {
      return Math.round(Math.random() * 500);
    });
  }

  getProfitChartData(period: string): ProfitChart {
    // const ch = 'test';
    // this.http.get('./assets/data/dashboard-graph.json').subscribe(data => {
    //   this.test = data;
    //   return this.data[ch];
    // });
    return this.data[period];
  }
}
