import { Component, OnInit, AfterViewInit, OnDestroy, OnChanges } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { LayoutService } from '../../../@core/utils';
import { takeWhile } from 'rxjs/operators';
import { DashboardSampleService } from '../../../@core/mock/dashboard-sample.service';
import { CardReqObj, CardResponseObj } from '../../../@theme/model/acquisition-card';
import { BarChartData, BarChartReq, LineChartReq, LineChartData } from '../../../@theme/model/acquisition-chart';
import { AcquisitionService } from '../../../@theme/services/acquisition.service';
import { OrdersProfitChartData } from '../../../@core/data/orders-profit-chart';
import { OrdersChart } from '../../../@core/data/orders-chart';
import { HttpClient } from '@angular/common/http';
import { GeoTableReq } from '../../../@theme/model/acquisition-table';
import { LocalDataSource } from 'ng2-smart-table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-on-ground',
  templateUrl: './on-ground.component.html',
  styleUrls: ['./on-ground.component.scss'],
})

export class OnGroundComponent implements AfterViewInit, OnDestroy, OnChanges {

  settings = {

    actions: false,
    // columns: {
    //   'Channel': {
    //     title: 'Channel',
    //     type: 'string',
    //     filter: false,
    //   },
    //   'New Leads': {
    //     title: 'New Leads',
    //     type: 'string',
    //     filter: false,
    //   },
    //   'New Customers': {
    //     title: 'New Customers',
    //     type: 'string',
    //     filter: false,
    //   },
    // },
    pager: {
      display: true,
      perPage: 4
    },
  };
  source: LocalDataSource = new LocalDataSource();
  tableReqOb: GeoTableReq;
  private alive = true;
  eTheme: any;
  echartLeadInstance: any;
  echartCustomerInstance: any;

  optionsLead: any = {};
  optionsCustomer: any = {};

  lineChartReqObj: LineChartReq;

  optionsLineUser: any = {};
  ordersChartData: LineChartData;
  eLineChartUserInstance: any;

  leadLineChartData: LineChartData;
  customerLineChartData: LineChartData;

  leadFlag = false;
  customerFlag = false;
  titleLineLeads = 'New Leads';
  titleLineCustomers = 'New Customers';
  cardReqObj = new CardReqObj();
  newLeads = new CardResponseObj();
  newCustomer = new CardResponseObj();
  statusCards: any[] = [];
  period: string = 'week';
  subscription: Subscription;

  constructor(private themeService: NbThemeService, private acquisitionServcie: AcquisitionService,
    private layoutService: LayoutService, private ordersProfitChartService: OrdersProfitChartData,
    private dashboardService: DashboardSampleService, private http: HttpClient) {
    this.tableReqOb = new GeoTableReq();
    this.cardReqObj = new CardReqObj();
    this.lineChartReqObj = new LineChartReq();
    this.subscription = this.acquisitionServcie.filter
      .subscribe(data => {
        if (data !== '') {
          if (data.start_date != '') {
            this.cardReqObj.start_date = data.start_date;
            this.lineChartReqObj.start_date = data.start_date;
            this.tableReqOb.start_date = data.start_date;
          }
          if (data.end_date != '') {
            this.tableReqOb.end_date = data.end_date;
            this.cardReqObj.end_date = data.end_date;
            this.lineChartReqObj.end_date = data.end_date;
          }
          if (data.segment != '') {
            this.lineChartReqObj.segment = data.segment;
            this.tableReqOb.segment = data.segment;
          }
          this.statusCards = [];
          this.getAllFunctions();
        } else {
          this.tableReqOb = new GeoTableReq();
          this.cardReqObj = new CardReqObj();
          this.lineChartReqObj = new LineChartReq();
          this.statusCards = [];
          this.getAllFunctions();
        }
      });
    this.layoutService.onChangeLayoutSize()
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe(() => this.resizeChart());
  }
  getAllFunctions() {
    this.tableReqOb.channel_type = ['store', 'event'];
    this.tableReqOb.dimension = 'channel';
    this.tableReqOb.column = ['new_leads', 'new_customers'];
    this.cardReqObj.channel_type = ['store', 'event'];
    this.lineChartReqObj.channel_type = ['store', 'event'];
    this.newLeads.title = 'New Leads';
    this.newCustomer.title = 'New Customers';
    this.statusCards.push(this.newLeads);
    this.statusCards.push(this.newCustomer);
    this.getLeadsCount();
    this.getCustomersCount();
    this.getLeadLineChartData();
    this.getCustomerLineChartData();
    this.getTableData();
  }
  getTableData() {
    this.acquisitionServcie.getTableData(this.tableReqOb).subscribe(data => {
      if (data) {
        // console.log('data', data);
        let new_setting = {
          actions: false,
          columns: {},
          pager: {
            display: true,
            perPage: 4
          },
        }
        data.data.columns.forEach(ele => {
          new_setting.columns[ele] = { title: ele, filter: false };
        });
        this.settings = Object.assign({}, new_setting);
        this.source.load(data.data.tableData);
      }
    });
  }
  getLeadLineChartData() {
    this.lineChartReqObj.metric = 'new_leads';
    this.lineChartReqObj.dimension = 'date';
    this.acquisitionServcie.getLineChartData(this.lineChartReqObj)
      .pipe(takeWhile(() => this.alive))
      .subscribe(ordersChartData => {
        if (ordersChartData.data.data.length) {
          this.leadFlag = true;
          this.leadLineChartData = ordersChartData.data;
          this.convertDate(this.leadLineChartData);
          this.optionsLead = this.setOption(this.eTheme);
          this.optionsLead = this.updateOrdersChartOptions(this.leadLineChartData, this.optionsLead);
        }
      });
  }

  convertDate(data: LineChartData) {
    data.chartLabel.forEach((element: any, index) => {
      var t = new Date(1970, 0, 1); // Epoch
      t.setSeconds(element);
      // var curdate = new Date();
      // curdate.setTime(element * 1000);
      data.chartLabel[index] = t.toLocaleDateString();
    });
  }
  getCustomerLineChartData() {
    this.lineChartReqObj.metric = 'new_customers';
    this.lineChartReqObj.dimension = 'date';
    this.acquisitionServcie.getLineChartData(this.lineChartReqObj)
      .pipe(takeWhile(() => this.alive))
      .subscribe(ordersChartData => {
        if (ordersChartData.data.data.length) {
          this.customerFlag = true;
          this.customerLineChartData = ordersChartData.data;
          this.convertDate(this.customerLineChartData);
          this.optionsCustomer = this.setOption(this.eTheme);
          this.optionsCustomer = this.updateOrdersChartOptions(this.customerLineChartData, this.optionsCustomer);
        }
      });
  }

  getLeadsCount() {
    this.cardReqObj.segment = 'new_leads';
    this.acquisitionServcie.getLeadsCount(this.cardReqObj)
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.newLeads = data.data;
        this.newLeads.title = 'New Leads';
        // this.statusCards.push(this.newLeads);
        this.statusCards[0] = this.newLeads;
      });
  }
  getCustomersCount() {
    this.cardReqObj.segment = 'new_customers';
    this.acquisitionServcie.getCustomersCount(this.cardReqObj)
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.newCustomer = data.data;
        this.newCustomer.title = 'New Customers';
        // this.statusCards.push(this.newCustomer);
        this.statusCards[1] = this.newCustomer;
      });
  }

  ngOnChanges(): void {

    if (this.optionsLead) {
      this.optionsLead = this.updateOrdersChartOptions(this.leadLineChartData, this.optionsLead);
    }
    if (this.optionsCustomer) {
      this.optionsCustomer = this.updateOrdersChartOptions(this.customerLineChartData, this.optionsCustomer);
    }
  }

  ngAfterViewInit() {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(config => {
        this.eTheme = config.variables.orders;
        this.optionsLead = this.setOption(this.eTheme);
        this.optionsCustomer = this.setOption(this.eTheme);
        this.optionsLead = this.updateOrdersChartOptions(this.leadLineChartData, this.optionsLead);
        this.optionsCustomer = this.updateOrdersChartOptions(this.customerLineChartData, this.optionsCustomer)
      });
  }
  setOption(eTheme) {
    return {
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
        top: 20,
      },
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: eTheme.tooltipLineColor,
            width: eTheme.tooltipLineWidth,
          },
        },
        textStyle: {
          color: eTheme.tooltipTextColor,
          fontSize: eTheme.tooltipFontSize,
          fontWeight: eTheme.tooltipFontWeight,
        },
        position: 'top',
        backgroundColor: eTheme.tooltipBg,
        borderColor: eTheme.tooltipBorderColor,
        borderWidth: 3,
        formatter: (params) => {
          return Math.round(parseInt(params.value, 10));
        },
        extraCssText: eTheme.tooltipExtraCss,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        offset: 5,
        data: [],
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: eTheme.axisTextColor,
          fontSize: eTheme.axisFontSize,
        },
        axisLine: {
          lineStyle: {
            color: eTheme.axisLineColor,
            width: '2',
          },
        },
      },
      yAxis: {
        type: 'value',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: eTheme.axisLineColor,
            width: '1',
          },
        },
        axisLabel: {
          color: eTheme.axisTextColor,
          fontSize: eTheme.axisFontSize,
        },
        axisTick: {
          show: false,
        },
        splitLine: {

          lineStyle: {
            color: eTheme.yAxisSplitLine,
            width: '1',
          },
        },
      },
      series: [
        this.getSecondLine(eTheme),
      ],
    };
  }

  updateOrdersChartOptions(lineChartData: LineChartData, option) {
    if (lineChartData) {
      const options = option;
      const series = this.getNewSeries(options.series, lineChartData.data);
      const xAxis = this.getNewXAxis(options.xAxis, lineChartData.chartLabel);

      option = {
        ...options,
        xAxis,
        series,
      };
    }
    return option
  }


  getNewXAxis(xAxis, chartLabel: string[]) {
    return {
      ...xAxis,
      data: chartLabel,
    };
  }

  getNewSeries(series, data: number[][]) {
    return series.map((line, index) => {
      return {
        ...line,
        data: data[index],
      };
    });
  }

  onLeadLineChartInit(echarts) {
    this.echartLeadInstance = echarts;
  }

  onCustomerLineChartInit(echarts) {
    this.echartCustomerInstance = echarts;
  }

  resizeChart() {
    if (this.echartLeadInstance) {
      setTimeout(() => {
        this.echartLeadInstance.resize();
      }, 0);
    }
    if (this.echartCustomerInstance) {
      setTimeout(() => {
        this.echartCustomerInstance.resize();
      }, 0);
    }
  }

  getSecondLine(eTheme) {
    return {
      type: 'line',
      smooth: true,
      symbolSize: 20,
      itemStyle: {
        normal: {
          opacity: 0,
        },
        emphasis: {
          color: '#ffffff',
          borderColor: eTheme.itemBorderColor,
          borderWidth: 2,
          opacity: 1,
        },
      },
      lineStyle: {
        normal: {
          width: eTheme.lineWidth,
          type: eTheme.lineStyle,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#523EB2',
          }, {
            offset: 1,
            color: '#7659FF',
          }]),
        },
      },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#523EB2',
          }, {
            offset: 1,
            color: '#7659FF',
          }]),
        },
      },
      data: [],
    };
  }

  ngOnDestroy() {
    this.alive = false;
    this.subscription.unsubscribe();
  }
}

