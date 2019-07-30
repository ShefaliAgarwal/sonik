import { Component, OnInit, AfterViewInit, OnDestroy, OnChanges } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { LayoutService } from '../../../@core/utils';
import { takeWhile } from 'rxjs/operators';
import { DashboardSampleService } from '../../../@core/mock/dashboard-sample.service';
import { CardReqObj, CardResponseObj } from '../../../@theme/model/acquisition-card';
import { BarChartData, BarChartReq, LineChartReq, LineChartData } from '../../../@theme/model/acquisition-chart';
import { AcquisitionService } from '../../../@theme/services/acquisition.service';
import { OrdersProfitChartData } from '../../../@core/data/orders-profit-chart';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-websites',
  templateUrl: './websites.component.html',
  styleUrls: ['./websites.component.scss']
})

export class WebsitesComponent implements AfterViewInit, OnDestroy, OnChanges {

  private alive = true;
  geographyBarData: BarChartData;
  channelBarData: BarChartData;
  sourceBarData: BarChartData;
  campaignBarData: BarChartData;

  userFlag = false;
  leadFlag = false;
  customerFlag = false;

  geographyFlag = false;
  channelFlag = false;
  sourceFlag = false;
  campaignFlag = false;

  eTheme: any;
  echartGeographyInstance: any;
  echartChannelInstance: any;
  echartSourceInstance: any;
  echartCampaignInstance: any;
  echartLeadInstance: any;
  echartCustomerInstance: any;

  optionsGeography: any = {};
  optionsChannel: any = {};
  optionsSources: any = {};
  optionsCampaign: any = {};
  optionsLeadMix: any = {};
  optionsCustomerMix: any = {};

  barChartReqObj: BarChartReq;

  mixLeadChartData = ['New Leads', 'Lead Generation Rate'];
  mixCutomerChartData = ['New Customers', 'Customer Generation Rate'];
  labelData = [];

  lineChartReqObj: LineChartReq;

  optionsLineUser: any = {};
  ordersChartData: LineChartData;
  eLineChartUserInstance: any;

  leadMixChartData: LineChartData;
  customerMixChartData: LineChartData;

  titleGeography = 'Top 5 Geographies- City';
  titleChannel = 'Top 5 channels';
  titleSouce = 'Top 5 sources- source/med combo';
  titleCampaign = 'Top 5 Campaigns';
  titleLineUser = 'New Users';
  titleLineLeads = 'New Leads & Lead Generation Rate';
  titleLineCustomers = 'New Customers & Customer Generation Rate';
  cardReqObj = new CardReqObj();
  newUsers = new CardResponseObj();
  newLeads = new CardResponseObj();
  newCustomer = new CardResponseObj();
  leadGenerationRate = new CardResponseObj();
  customerGenerationRate = new CardResponseObj();
  statusCards: any[] = [];
  period: string = 'week';
  isAquisitionWebsiteFlag: any;
  subscription: Subscription;

  commonStatusCardsSet: CardResponseObj[] = [this.newUsers,
  this.newLeads,
  this.newCustomer,
  this.leadGenerationRate,
  this.customerGenerationRate];

  constructor(private themeService: NbThemeService, private acquisitionServcie: AcquisitionService,
    private layoutService: LayoutService, private ordersProfitChartService: OrdersProfitChartData,
    private dashboardService: DashboardSampleService, private http: HttpClient,
    private route: ActivatedRoute) {
    this.cardReqObj = new CardReqObj();
    this.barChartReqObj = new BarChartReq();
    this.lineChartReqObj = new LineChartReq();
    this.route.params.subscribe(params => {
      if (params.page === 'AW') {
        this.isAquisitionWebsiteFlag = true;
      } else if (params.page === 'AA') {
        this.isAquisitionWebsiteFlag = false;
      }
    });

    this.subscription = this.acquisitionServcie.filter
      .subscribe(data => {
        if (data !== '') {
          if (data.start_date != '') {
            this.cardReqObj.start_date = data.start_date;
            this.barChartReqObj.start_date = data.start_date;
            this.lineChartReqObj.start_date = data.start_date;
          }
          if (data.end_date != '') {
            this.cardReqObj.end_date = data.end_date;
            this.barChartReqObj.end_date = data.end_date;
            this.lineChartReqObj.end_date = data.end_date
          }
          if (data.segment != '') {
            this.barChartReqObj.segment = data.segment;
            this.lineChartReqObj.segment = data.segment;
          }
          this.statusCards = [];
          this.getAllFunctions();
        } else {
          this.barChartReqObj = new BarChartReq();
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
    if (this.isAquisitionWebsiteFlag) {
      this.cardReqObj.channel_type = 'website';
      this.barChartReqObj.channel_type = 'website';
      this.lineChartReqObj.channel_type = 'website';
    } else {
      this.cardReqObj.channel_type = ['androidApp', 'iOSApp'];
      this.barChartReqObj.channel_type = ['androidApp', 'iOSApp'];
      this.lineChartReqObj.channel_type = ['androidApp', 'iOSApp'];
    }
    this.newUsers.title = "New Users";
    this.newLeads.title = 'New Leads';
    this.newCustomer.title = 'New Customers';
    this.customerGenerationRate.title = 'Customer Generation Rate';
    this.leadGenerationRate.title = "Lead Generation Rate";
    this.statusCards.push(this.newUsers);
    this.statusCards.push(this.newLeads);
    this.statusCards.push(this.newCustomer);
    this.statusCards.push(this.leadGenerationRate);
    this.statusCards.push(this.customerGenerationRate);
    this.getGeographyBarData();
    this.getChannelBarData();
    this.getCampaignBarData();
    this.getSourceBarData();
    this.getUsersCount();
    this.getLeadsCount();
    this.getCustomersCount();
    this.getLeadsRate();
    this.getCustomersRate();
    this.getOrdersChartData(this.period);
    this.getMixLeadChartData();
    this.getMixCustomerChartData();
  }
  getOrdersChartData(period: string) {
    console.log('get user');
    this.lineChartReqObj.metric = 'new_users';
    this.lineChartReqObj.dimension = 'date';
    this.acquisitionServcie.getLineChartData(this.lineChartReqObj)
      .pipe(takeWhile(() => this.alive))
      .subscribe(ordersChartData => {
        if (ordersChartData.data.data.length) {
          this.userFlag = true;
          this.ordersChartData = ordersChartData.data;
          this.convertDate(this.ordersChartData);
          this.updateOrdersChartOptions(this.ordersChartData);
        }
      });
  }
  getMixLeadChartData() {
    this.lineChartReqObj.metric = ['new_leads', 'leads_generation'];
    this.lineChartReqObj.dimension = 'date';
    this.acquisitionServcie.getLineChartData(this.lineChartReqObj)
      .pipe(takeWhile(() => this.alive))
      .subscribe(ordersChartData => {
        if (ordersChartData.data.data.length) {
          this.leadFlag = true;
          this.leadMixChartData = ordersChartData.data;
          console.log('leadMixChartData', this.leadMixChartData);
          this.convertDate(this.leadMixChartData);
          this.optionsLeadMix = this.setOptionsMix(this.eTheme, this.leadMixChartData, this.mixLeadChartData);
        }
        // this.updateMixChartOptions(this.leadMixChartData);
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
  getMixCustomerChartData() {
    this.lineChartReqObj.metric = ['new_customers', 'customer_generation'];
    this.lineChartReqObj.dimension = 'date';
    this.acquisitionServcie.getLineChartData(this.lineChartReqObj)
      .pipe(takeWhile(() => this.alive))
      .subscribe(ordersChartData => {
        if (ordersChartData.data.data.length) {
          this.customerFlag = true;
          this.customerMixChartData = ordersChartData.data;
          this.convertDate(this.customerMixChartData);
          this.optionsCustomerMix = this.setOptionsMix(this.eTheme, this.customerMixChartData, this.mixCutomerChartData);
          // this.updateMixChartOptions(this.customerMixChartData);
        }
      });
  }

  getGeographyBarData() {
    this.barChartReqObj.dimension = 'city';
    this.acquisitionServcie.getBarChartData(this.barChartReqObj)
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.geographyBarData = data.data;
        if (this.geographyBarData.data[0].length) {
          this.geographyFlag = true;
        }
        this.optionsGeography = this.setOptions(this.eTheme, this.geographyBarData);
      });
  }

  getChannelBarData() {
    this.barChartReqObj.dimension = 'channel';
    this.acquisitionServcie.getBarChartData(this.barChartReqObj)
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.channelBarData = data.data;
        if (this.channelBarData.data[0].length) {
          this.channelFlag = true;
        }
        this.optionsChannel = this.setOptions(this.eTheme, this.channelBarData);
      });
  }

  getSourceBarData() {
    this.barChartReqObj.dimension = 'source_medium';
    this.acquisitionServcie.getBarChartData(this.barChartReqObj)
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.sourceBarData = data.data;
        if (this.sourceBarData.data[0].length) {
          this.sourceFlag = true;
        }
        this.optionsSources = this.setOptions(this.eTheme, this.sourceBarData);
      });
  }

  getCampaignBarData() {
    this.barChartReqObj.dimension = 'campaign';
    this.acquisitionServcie.getBarChartData(this.barChartReqObj)
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.campaignBarData = data.data;
        if (this.campaignBarData.data[0].length) {
          this.campaignFlag = true;
        }
        this.optionsCampaign = this.setOptions(this.eTheme, this.campaignBarData);
      });
  }

  getUsersCount() {
    this.cardReqObj.segment = 'new_profiles';
    this.acquisitionServcie.getUsersCount(this.cardReqObj)
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.newUsers = data.data;
        this.newUsers.title = 'New Users';
        this.statusCards[0] = this.newUsers;
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
        this.statusCards[1] = this.newLeads;
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
        this.statusCards[2] = this.newCustomer;
      });
  }
  getCustomersRate() {
    this.cardReqObj.segment = undefined;
    this.acquisitionServcie.getCustomersRate(this.cardReqObj)
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.customerGenerationRate = data.data;
        // this.customerGenerationRate.rate = true;
        if (!this.customerGenerationRate.count) {
          this.customerGenerationRate.count = 0;
        }
        this.customerGenerationRate.title = 'Customer Generation Rate';
        // this.statusCards.push(this.customerGenerationRate);
        this.statusCards[4] = this.customerGenerationRate;
      });
  }
  getLeadsRate() {
    this.cardReqObj.segment = undefined;
    this.acquisitionServcie.getLeadsRate(this.cardReqObj)
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.leadGenerationRate = data.data;
        // this.leadGenerationRate.rate = true;
        if (!this.leadGenerationRate.count) {
          this.leadGenerationRate.count = 0;
        }
        this.leadGenerationRate.title = 'Lead Generation Rate';
        // this.statusCards.push(this.leadGenerationRate);
        this.statusCards[3] = this.leadGenerationRate;

      });
  }

  ngOnChanges(): void {
    if (this.echartGeographyInstance) {
      this.updateBarChart(this.geographyBarData, this.optionsGeography, this.echartGeographyInstance);
    }
    if (this.echartChannelInstance) {
      this.updateBarChart(this.channelBarData, this.optionsChannel, this.echartChannelInstance);
    }
    if (this.echartSourceInstance) {
      this.updateBarChart(this.sourceBarData, this.optionsSources, this.echartSourceInstance);
    }
    if (this.echartCampaignInstance) {
      this.updateBarChart(this.campaignBarData, this.optionsCampaign, this.echartCampaignInstance);
    }
    if (this.echartLeadInstance) {
      this.updateBarChart(this.leadMixChartData, this.optionsLeadMix, this.echartLeadInstance);
    } if (this.echartCustomerInstance) {
      this.updateBarChart(this.customerMixChartData, this.optionsCustomerMix, this.echartCustomerInstance);
    }
    if (this.optionsLineUser) {
      this.updateOrdersChartOptions(this.ordersChartData);
    }
  }

  ngAfterViewInit() {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(config => {
        this.eTheme = config.variables.profit;
        if (this.geographyBarData) {
          this.optionsGeography = this.setOptions(this.eTheme, this.geographyBarData);
        }
        if (this.channelBarData) {
          this.optionsChannel = this.setOptions(this.eTheme, this.channelBarData);
        }
        if (this.sourceBarData) {
          this.optionsSources = this.setOptions(this.eTheme, this.sourceBarData);
        }
        if (this.campaignBarData) {
          this.optionsCampaign = this.setOptions(this.eTheme, this.campaignBarData);
        }
        if (this.leadMixChartData) {
          this.optionsLeadMix = this.setOptions(this.eTheme, this.leadMixChartData);
        }
        if (this.customerMixChartData) {
          this.optionsCustomerMix = this.setOptions(this.eTheme, this.customerMixChartData);
        }
        const oTheme: any = config.variables.orders;
        this.setOption(oTheme);
        this.updateOrdersChartOptions(this.ordersChartData);
      });
  }
  setOption(eTheme) {
    this.optionsLineUser = {
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

  setOptionsMix(eTheme, lineChartData: LineChartData, labelData) {
    return {
      backgroundColor: eTheme.bg,
      tooltip: {
        trigger: 'axis',
        // axisPointer: {
        //   type: 'shadow',
        //   shadowStyle: {
        //     color: 'rgba(0, 0, 0, 0.3)',
        //   },
        // },
      },
      legend: {
        data: labelData,
        // borderWidth: 0,
        // borderRadius: 0,
        // itemWidth: 15,
        // itemHeight: 15,
        // textStyle: {
        //   color: eTheme.textColor,
        // },
      },
      // legend: {
      //   data: ['Canceled', 'Payment'],
      //   textStyle: {
      //     color: eTheme.axisTextColor,
      //   },
      // },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: lineChartData.chartLabel,
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
          name: labelData[0],
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
          data: lineChartData.data[0],
        },
        {
          name: labelData[1],
          type: 'line',
          yAxisIndex: 1,
          // barWidth: '20%',
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
          data: lineChartData.data[1],
        },
      ],
    };
  }

  updateOrdersChartOptions(lineChartData: LineChartData) {
    if (lineChartData) {
      const options = this.optionsLineUser;
      const series = this.getNewSeries(options.series, lineChartData.data);
      const xAxis = this.getNewXAxis(options.xAxis, lineChartData.chartLabel);

      this.optionsLineUser = {
        ...options,
        xAxis,
        series,
      };
    }
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

  onLineChartInit(echarts) {
    this.eLineChartUserInstance = echarts;
  }
  onGeographyChartInit(echarts) {
    this.echartGeographyInstance = echarts;
  }
  onChannelChartInit(echarts) {
    this.echartChannelInstance = echarts;
  }
  onCampaignChartInit(echarts) {
    this.echartCampaignInstance = echarts;
  }
  onLeadMixChartInit(echarts) {
    this.echartLeadInstance = echarts;
  }
  onCustomerMixChartInit(echarts) {
    this.echartCustomerInstance = echarts;
  }
  onSourceChartInit(echarts) {
    this.echartSourceInstance = echarts;
  }
  resizeChart() {
    if (this.echartGeographyInstance) {
      setTimeout(() => {
        this.echartGeographyInstance.resize();
      }, 0);
    }
    if (this.echartCampaignInstance) {
      setTimeout(() => {
        this.echartCampaignInstance.resize();
      }, 0);
    }
    if (this.echartChannelInstance) {
      setTimeout(() => {
        this.echartChannelInstance.resize();
      }, 0);
    }
    if (this.echartSourceInstance) {
      setTimeout(() => {
        this.echartSourceInstance.resize();
      }, 0);
    }
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
    if (this.eLineChartUserInstance) {
      setTimeout(() => {
        this.eLineChartUserInstance.resize();
      }, 0);
    }
  }

  getFirstLine(eTheme) {
    return {
      type: 'line',
      smooth: true,
      symbolSize: 20,
      itemStyle: {
        normal: {
          opacity: 0,
        },
        emphasis: {
          opacity: 0,
        },
      },
      lineStyle: {
        normal: {
          width: 0,
        },
      },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: eTheme.firstAreaGradFrom,
          }, {
            offset: 1,
            color: eTheme.firstAreaGradTo,
          }]),
          opacity: 1,
        },
      },
      data: [],
    };
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

  getThirdLine(eTheme) {
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

