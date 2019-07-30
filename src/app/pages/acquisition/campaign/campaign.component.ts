
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeWhile } from 'rxjs/operators';
import { registerMap } from 'echarts';
import { combineLatest, Subscription } from 'rxjs';
import { NbThemeService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';

import { SmartTableData } from '../../../@core/data/smart-table';
import { AcquisitionService } from '../../../@theme/services/acquisition.service';
import { GeoTableReq, GeoMapData } from '../../../@theme/model/acquisition-table';
import { latLong } from '../../../@theme/model/acquisition-table';
import { BarChartData, BarChartReq } from '../../../@theme/model/acquisition-chart';
import { LayoutService } from '../../../@core/utils';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ngx-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})

export class CampaignComponent implements OnDestroy, AfterViewInit {
  tableReqOb: GeoTableReq;
  campaignBarData: BarChartData;
  barChartReqObj: BarChartReq;

  campaignFlag = false;
  isCampaignWebsiteFlag: any;

  eTheme: any;
  echartCampaignInstance: any;
  optionsCampaign: any = {};
  titleCampaign = 'Campaign';
  public alive = true;

  settings = {

    actions: false,
    // columns: {
    //   'Campaign': {
    //     title: 'Campaign',
    //     type: 'string',
    //     filter: false,

    //   },
    //   'New Users': {
    //     title: 'New Users',
    //     type: 'number',
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
    //   'Bounce Sessions': {
    //     title: 'Sessions',
    //     type: 'string',
    //     filter: false,
    //   },
    //   'Unbounce Sessions': {
    //     title: 'Unbounce Sessions',
    //     type: 'string',
    //     filter: false,
    //   },
    // },
    pager: {
      display: true,
      perPage: 4
    },
  };
  channelSettings = {

    actions: false,
    // columns: {
    //   'Channel': {
    //     title: 'Channel',
    //     type: 'string',
    //     filter: false,

    //   },
    //   'New Users': {
    //     title: 'New Users',
    //     type: 'number',
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
    //   'Bounce Sessions': {
    //     title: 'Sessions',
    //     type: 'string',
    //     filter: false,
    //   },
    //   'Unbounce Sessions': {
    //     title: 'Unbounce Sessions',
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
  subscription: Subscription;


  constructor(private theme: NbThemeService, private layoutService: LayoutService,
    private aquisitionService: AcquisitionService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      if (params.page === 'ACG') {
        this.isCampaignWebsiteFlag = true;
      } else if (params.page === 'ACN') {
        this.isCampaignWebsiteFlag = false;
      }
    });
    this.tableReqOb = new GeoTableReq();
    this.barChartReqObj = new BarChartReq();
    this.subscription = this.aquisitionService.filter
      .subscribe(data => {
        if (data !== '') {
          if (data.start_date != '') {
            this.tableReqOb.start_date = data.start_date;
            this.barChartReqObj.start_date = data.start_date;
          }
          if (data.end_date != '') {
            this.tableReqOb.end_date = data.end_date;
            this.barChartReqObj.end_date = data.end_date;
          }
          if (data.segment != '') {
            this.barChartReqObj.segment = data.segment;
            this.tableReqOb.segment = data.segment;
          }
          this.getAllFunctions();
        } else {
          this.barChartReqObj = new BarChartReq();
          this.tableReqOb = new GeoTableReq();
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
    this.barChartReqObj.channel_type = undefined;
    this.barChartReqObj.size = 20;
    this.tableReqOb.channel_type = undefined;
    this.tableReqOb.column = ['new_users', 'new_leads', 'new_customers', 'bounce_sessions', 'unbounce_sessions']
    if (this.isCampaignWebsiteFlag) {
      this.barChartReqObj.dimension = 'campaign';
      this.tableReqOb.dimension = 'campaign';
      this.getCampaignData();
      this.titleCampaign = 'Campaign';
    } else {
      this.barChartReqObj.dimension = 'channel';
      this.tableReqOb.dimension = 'channel';
      this.getCampaignData();
      this.titleCampaign = 'Channel';
    }
    this.getTableData();
  }
  ngOnDestroy() {
    this.alive = false;
    this.subscription.unsubscribe();
  }
  ngOnChanges(): void {
    if (this.echartCampaignInstance) {
      this.updateBarChart(this.campaignBarData, this.optionsCampaign, this.echartCampaignInstance);
    }
  }


  ngAfterViewInit() {
    this.theme.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(config => {
        this.eTheme = config.variables.profit;
        if (this.campaignBarData) {
          this.optionsCampaign = this.setOptions(this.eTheme, this.campaignBarData);
        }
      });
  }

  updateBarChart(barChartData: BarChartData, Options, echartInstance) {
    const options = Options;
    const series = this.getNewSeries(options.series, barChartData.data);

    echartInstance.setOption({
      series: series,
      xAxis: {
        data: barChartData.chartLabel,
      },
    });
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
  onCampaignChartInit(echarts) {
    this.echartCampaignInstance = echarts;
  }
  getCampaignData() {
    this.aquisitionService.getBarChartData(this.barChartReqObj)
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.campaignBarData = data.data;
        if (this.campaignBarData.data[0].length) {
          this.campaignFlag = true;
        }
        this.optionsCampaign = this.setOptions(this.eTheme, this.campaignBarData);
      });
  }

  setOptions(eTheme, barChartData: BarChartData) {
    return {
      backgroundColor: eTheme.bg,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(0, 0, 0, 0.3)',
          },
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: barChartData.chartLabel,
          axisTick: {
            alignWithLabel: true,
          },
          axisLine: {
            lineStyle: {
              color: eTheme.axisLineColor,
            },
          },
          axisLabel: {
            color: eTheme.axisTextColor,
            fontSize: eTheme.axisFontSize,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: eTheme.axisLineColor,
            },
          },
          splitLine: {
            lineStyle: {
              color: eTheme.splitLineColor,
            },
          },
          axisLabel: {
            color: eTheme.axisTextColor,
            fontSize: eTheme.axisFontSize,
          },
        },
      ],
      series: [
        {
          // name: 'Canceled',
          type: 'bar',
          barGap: 0,
          barWidth: '20%',
          itemStyle: {
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
          data: barChartData.data[0],
        },
      ],
    };
  }
  getTableData() {
    this.aquisitionService.getTableData(this.tableReqOb).subscribe(data => {
      if (data) {
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
        if (this.isCampaignWebsiteFlag) {
          this.settings = Object.assign({}, new_setting);
        } else {
          this.channelSettings = Object.assign({}, new_setting);
        }
        this.source.load(data.data.tableData);
      }
    });
  }
  resizeChart() {
    if (this.echartCampaignInstance) {
      setTimeout(() => {
        this.echartCampaignInstance.resize();
      }, 0);
    }
  }
}


