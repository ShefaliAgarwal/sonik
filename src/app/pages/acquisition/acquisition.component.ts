import { Component, OnInit, OnDestroy } from '@angular/core';
import { CardResponseObj } from '../../@theme/model/acquisition-card';
import { PieChartData, EngBarChartData } from '../../@theme/model/engagement';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { LayoutService } from '../../@core/utils';
import { BarChartData } from '../../@theme/model/acquisition-chart';

@Component({
  selector: 'ngx-acquisition',
  templateUrl: './acquisition.component.html',
  styleUrls: ['./acquisition.component.scss']
})
export class AcquisitionComponent implements OnInit, OnDestroy {

  statusCards: CardResponseObj[] = [{ 'title': 'New Users', 'count': '250', 'percentage': '25', 'increment': true, 'text': 'compare to last week' },
  { 'title': 'Total Users', 'count': '250', 'percentage': '25', 'increment': true, 'text': 'compare to last week' },
  { 'title': 'Interactions', 'count': '250', 'percentage': '25', 'increment': true, 'text': 'compare to last week' },
  { 'title': 'Notifications Sent', 'count': '500', 'percentage': '25', 'increment': true, 'text': 'compare to last week' },
  { 'title': 'Conversions', 'count': '100', 'percentage': '25', 'increment': true, 'text': 'compare to last week' }];

  cityPieData: PieChartData = { 'chartLabel': ['Jakarta', 'Kuala Lumpur', 'Singapore', 'Bandung', 'Bangkok'], 'data': [[30], [24], [22], [15], [9]] };
  notificationPieData: BarChartData = { 'chartLabel': ['Sent', 'Received', 'Opened', 'Conversions'], 'data': [[590, 490, 400, 100]] };
  campaignPieData: PieChartData = { 'chartLabel': ['Retargeting', 'Estee_retargeting', 'Danone_Intital', 'Vans Awareness', 'Awareness'], 'data': [[30], [24], [22], [15], [9]] };
  tonePieData: PieChartData = { 'chartLabel': ['Tokopedia 1', 'Bukalapak 2', 'Danone 1.2', 'Toyoto 3', 'Mitsuibishi'], 'data': [[30], [24], [22], [15], [9]] };

  cityFlag = true;
  notificationsFlag = true;
  campaignFlag = true;
  toneFlag = true;

  eTheme: any;
  echartCityInstance: any;
  echartNotificationInstance: any;
  echartCampaignInstance: any;
  echartToneInstance: any;

  optionsCity: any = {};
  optionsNotifications: any = {};
  optionsCampaign: any = {};
  optionsTone: any = {};
  private alive = true;
  constructor(private themeService: NbThemeService, private layoutService: LayoutService) {
    // this.getChannelPieData();
    this.layoutService.onChangeLayoutSize()
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe(() => this.resizeChart());
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(config => {
        this.eTheme = config.variables.earningPie;
        if (this.cityPieData) {
          this.optionsCity = this.setOptions(this.eTheme, this.cityPieData);
        }
        if (this.notificationPieData) {
          this.optionsNotifications = this.setOptionsBar(this.eTheme, this.notificationPieData);
        }
        if (this.campaignPieData) {
          this.optionsCampaign = this.setOptions(this.eTheme, this.campaignPieData);
        }
        if (this.tonePieData) {
          this.optionsTone = this.setOptions(this.eTheme, this.tonePieData);
        }
      });
  }
  ngOnChanges(): void {
    if (this.echartCityInstance) {
      this.updateBarChart(this.cityPieData, this.optionsCity, this.echartCityInstance);
    }
    if (this.echartNotificationInstance) {
      this.updateBarChart(this.notificationPieData, this.optionsNotifications, this.echartNotificationInstance);
    }
    if (this.echartCampaignInstance) {
      this.updateBarChart(this.campaignPieData, this.optionsCampaign, this.echartCampaignInstance);
    }
    if (this.echartToneInstance) {
      this.updateBarChart(this.tonePieData, this.optionsTone, this.echartToneInstance);
    }
  }

  updateBarChart(barChartData: EngBarChartData, Options, echartInstance) {
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

  setOptions(eTheme, pieChartData: PieChartData) {
    console.log('eTheme.center', eTheme.center);
    console.log('eTheme.radius', eTheme.radius)
    return {
      backgroundColor: eTheme.bg,
      tooltip: {
        trigger: 'item',
        formatter: '{d} %',
        // formatter: '{b} : {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: pieChartData.chartLabel,
      },
      calculable: true,
      series: [
        {
          type: 'pie',
          center: ['50%', '60%'],
          radius: ['50%', '70%'],
          data: pieChartData.data,
          // itemStyle: {
          //   shadowColor: 'darkred',
          //   shadowBlur: 0,
          //   shadowOffsetX: 0,
          //   shadowOffsetY: 3,
          //   emphasis: {
          //     shadowBlur: 10,
          //     shadowOffsetX: 0,
          //     shadowColor: eTheme.itemHoverShadowColor,
          //   },
          // },
          label: true,
          labelLine: true
        },
      ],
    };
  }
  setOptionsBar(eTheme, barChartData: BarChartData) {
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
      yAxis: [
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
  onCityChartInit(echarts) {
    this.echartCityInstance = echarts;
  }
  onNotificationsChartInit(echarts) {
    this.echartNotificationInstance = echarts;
  }
  onCampaignChartInit(echarts) {
    this.echartCampaignInstance = echarts;
  }
  onToneChartInit(echarts) {
    this.echartToneInstance = echarts;
  }
  getChannelPieData() {
    this.optionsCity = this.setOptions(this.eTheme, this.cityPieData);
    this.optionsNotifications = this.setOptionsBar(this.eTheme, this.notificationPieData);
    this.optionsCampaign = this.setOptions(this.eTheme, this.campaignPieData);
    this.optionsTone = this.setOptions(this.eTheme, this.tonePieData);
  }
  resizeChart() {
    if (this.echartCityInstance) {
      setTimeout(() => {
        this.echartCityInstance.resize();
      }, 0);
    }
  }
  ngOnDestroy() {
    this.alive = false;
  }
}
