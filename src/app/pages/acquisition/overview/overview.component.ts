import { Component, OnInit, AfterViewInit, OnDestroy, OnChanges } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { LayoutService } from '../../../@core/utils';
import { takeWhile } from 'rxjs/operators';
import { CardReqObj, CardResponseObj } from '../../../@theme/model/acquisition-card';
import { BarChartData, BarChartReq } from '../../../@theme/model/acquisition-chart';
import { AcquisitionService } from '../../../@theme/services/acquisition.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements AfterViewInit, OnDestroy, OnChanges {

  private alive = true;
  geographyBarData: BarChartData;
  channelBarData: BarChartData;
  sourceBarData: BarChartData;
  campaignBarData: BarChartData;

  geographyFlag = false;
  channelFlag = false;
  sourceFlag = false;
  campaignFlag = false;

  eTheme: any;
  echartGeographyInstance: any;
  echartChannelInstance: any;
  echartSourceInstance: any;
  echartCampaignInstance: any;

  optionsGeography: any = {};
  optionsChannel: any = {};
  optionsSources: any = {};
  optionsCampaign: any = {};
  barChartReqObj: BarChartReq;

  titleGeography = 'Top 5 Geographies- City';
  titleChannel = 'Top 5 channels';
  titleSouce = 'Top 5 sources- source/med combo';
  titleCampaign = 'Top 5 Campaigns';
  cardReqObj = new CardReqObj();
  newUsers = new CardResponseObj();
  newLeads = new CardResponseObj();
  newCustomer = new CardResponseObj();
  leadGenerationRate = new CardResponseObj();
  customerGenerationRate = new CardResponseObj();
  statusCards: any[] = [];
  period: string = 'week';

  commonStatusCardsSet: CardResponseObj[] = [this.newUsers,
  this.newLeads,
  this.newCustomer,
  this.leadGenerationRate,
  this.customerGenerationRate];

  subscription: Subscription;

  constructor(private themeService: NbThemeService, private acquisitionServcie: AcquisitionService,
    private layoutService: LayoutService) {
    this.barChartReqObj = new BarChartReq();
    this.cardReqObj = new CardReqObj();
    this.subscription = this.acquisitionServcie.filter
      .subscribe(data => {
        if (data !== '') {
          if (data.start_date != '') {
            this.cardReqObj.start_date = data.start_date;
            this.barChartReqObj.start_date = data.start_date;
          }
          if (data.end_date != '') {
            this.cardReqObj.end_date = data.end_date;
            this.barChartReqObj.end_date = data.end_date;
          }
          if (data.segment != '') {
            this.barChartReqObj.segment = data.segment;
          }
          this.statusCards = [];
          this.getAllFunctions();
        } else {
          this.barChartReqObj = new BarChartReq();
          this.cardReqObj = new CardReqObj();
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
    this.barChartReqObj.channel_type = undefined;
    this.cardReqObj.channel_type = undefined;
    this.newUsers.title = 'New Users';
    this.newLeads.title = 'New Leads';
    this.newCustomer.title = 'New Customers';
    this.customerGenerationRate.title = 'Customer Generation Rate';
    this.leadGenerationRate.title = 'Lead Generation Rate';
    this.statusCards.push(this.newUsers);
    this.statusCards.push(this.newLeads);
    this.statusCards.push(this.newCustomer);
    this.statusCards.push(this.leadGenerationRate);
    this.statusCards.push(this.customerGenerationRate);
    // this.getGraphData();
    this.getGeographyBarData();
    this.getChannelBarData();
    this.getCampaignBarData();
    this.getSourceBarData();
    this.getUsersCount();
    this.getLeadsCount();
    this.getCustomersCount();
    this.getLeadsRate();
    this.getCustomersRate();

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

  onGeographyChartInit(echarts) {
    this.echartGeographyInstance = echarts;
  }
  onChannelChartInit(echarts) {
    this.echartChannelInstance = echarts;
  }
  onCampaignChartInit(echarts) {
    this.echartCampaignInstance = echarts;
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
  }

  ngOnDestroy() {
    this.alive = false;
    this.subscription.unsubscribe();
  }
}
