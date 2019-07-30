import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeWhile } from 'rxjs/operators';
import { registerMap } from 'echarts';
import { combineLatest, Subscription } from 'rxjs';
import { NbThemeService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';

import { SmartTableData } from '../../../@core/data/smart-table';
import { AcquisitionService } from '../../../@theme/services/acquisition.service';
import { GeoTableReq, GeoMapData, GeoMapReq } from '../../../@theme/model/acquisition-table';
import { latLong } from '../../../@theme/model/acquisition-table';

@Component({
  selector: 'ngx-geo',
  templateUrl: './geo.component.html',
  styleUrls: ['./geo.component.scss']
})
export class GeoComponent implements OnDestroy {
  latlong: any = latLong;
  mapData: GeoMapData[];
  max = -Infinity;
  min = Infinity;
  options: any;
  initialCountryFlag = true;
  name = 'Country';

  geoTableReqOb: GeoTableReq;
  geoMapReqOb: GeoMapReq;
  bubbleTheme: any;
  geoColors: any[];

  private alive = true;

  settings = {

    actions: false,
    // columns: {
    //   'Country': {
    //     title: 'Country',
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
  citysettings = {
    actions: false,
    // columns: {
    //   'City': {
    //     title: 'City',
    //     type: 'number',
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
    //     title: 'Sessiosns',
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


  constructor(private theme: NbThemeService, private service: SmartTableData,
    private http: HttpClient, private aquisitionService: AcquisitionService) {
    this.geoTableReqOb = new GeoTableReq();
    this.geoMapReqOb = new GeoMapReq();
    this.subscription = this.aquisitionService.filter
      .subscribe(data => {
        if (data !== '') {
          if (data.start_date != '') {
            this.geoTableReqOb.start_date = data.start_date;
            this.geoMapReqOb.start_date = data.start_date;
          }
          if (data.end_date != '') {
            this.geoTableReqOb.end_date = data.end_date;
            this.geoMapReqOb.end_date = data.end_date;
          }
          if (data.segment != '') {
            this.geoTableReqOb.segment = data.segment;
            this.geoMapReqOb.segment = data.segment;
          }
          this.getAllFunctions();
        } else {
          this.geoTableReqOb = new GeoTableReq();
          this.geoMapReqOb = new GeoMapReq();
          this.getAllFunctions();
        }
      });
    this.theme.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe((config: any) => {

        const colors = config.variables;
        this.bubbleTheme = config.variables.bubbleMap;
        this.geoColors = [colors.primary, colors.info, colors.success, colors.warning, colors.danger];
      });
  }

  getAllFunctions() {
    this.geoTableReqOb.channel_type = undefined;
    this.geoMapReqOb.channel_type = undefined;
    this.getTableData();
    this.getMapData();
  }
  ngOnDestroy() {
    this.alive = false;
    this.subscription.unsubscribe();
  }

  mapMapData() {
    combineLatest([
      this.http.get('assets/map/world.json'),
      this.theme.getJsTheme(),
    ])
      .pipe(takeWhile(() => this.alive))
      .subscribe(([map, config]: [any, any]) => {

        registerMap('world', map);

        this.bubbleTheme = config.variables.bubbleMap;

        this.mapData.forEach((itemOpt) => {
          if (itemOpt.value > this.max) {
            this.max = itemOpt.value;
          }
          if (itemOpt.value < this.min) {
            this.min = itemOpt.value;
          }
        });

        this.options = {
          title: {
            // text: 'Country',
            left: 'center',
            top: 'top',
            textStyle: {
              color: this.bubbleTheme.titleColor,
            },
          },
          tooltip: {
            trigger: 'item',
            formatter: params => {
              return `${params.name}: ${params.value[2]}`;
            },
          },
          visualMap: {
            show: false,
            min: 0,
            max: this.max,
            inRange: {
              symbolSize: [6, 60],
            },
          },
          geo: {
            // name: 'Country',
            type: 'map',
            map: 'world',
            roam: true,
            label: {
              emphasis: {
                show: false,
              },
            },
            itemStyle: {
              normal: {
                areaColor: this.bubbleTheme.areaColor,
                borderColor: this.bubbleTheme.areaBorderColor,
              },
              emphasis: {
                areaColor: this.bubbleTheme.areaHoverColor,
              },
            },
            zoom: 2.2,
          },
          series: [
            {
              type: 'scatter',
              coordinateSystem: 'geo',
              data: this.mapData.map(itemOpt => {
                return {
                  name: itemOpt.name,
                  value: [
                    itemOpt.longitude,
                    itemOpt.latitude,
                    itemOpt.value,
                  ],
                  itemStyle: {
                    normal: {
                      color: itemOpt.color,
                    },
                  },
                };
              }),
            },
          ],
        };
      });
  }
  getTableData() {
    this.geoTableReqOb.column = ['new_users', 'new_leads', 'new_customers', 'bounce_sessions', 'unbounce_sessions']
    this.aquisitionService.getTableData(this.geoTableReqOb).subscribe(data => {
      if (data) {
        // console.log('data', data);
        // this.settings.columns.Country.title = this.name;
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
        if (this.name === 'Country') {
          this.settings = Object.assign({}, new_setting);
        } else {
          this.citysettings = Object.assign({}, new_setting);
        }
        this.source.load(data.data.tableData);
      }
    });
  }

  getMapData() {
    this.aquisitionService.getMapData(this.geoMapReqOb).subscribe(data => {
      if (data) {
        // tslint:disable-next-line:no-console
        // console.log('data', data);
        this.mapData = [];
        this.mapData = data.data.mapData;

        // for (let ob in this.mapData)
        // ob.color = this.getRandomGeoColor();

        // console.log(this.mapData)
        // this.mapData[0].name = 'INDIaaa';
        // this.mapData[0].color = this.getRandomGeoColor();
        // this.mapData[0].value= [
        //     "latutude":20,
        //     "longitude":77
        // ];
        // this.mapData[1].code = 'SG';
        // this.mapData[1].color = this.getRandomGeoColor();
        // this.mapData[2].code = 'MY';
        // this.mapData[2].color = this.getRandomGeoColor();
        // this.mapData[3].code = 'TH';
        // this.mapData[3].color = this.getRandomGeoColor();
        // this.mapData[4].code = 'ID';
        // this.mapData[4].color = this.getRandomGeoColor();
        this.mapMapData();
      }
    });
  }
  private getRandomGeoColor() {
    const index = Math.round(Math.random() * this.geoColors.length);
    return this.geoColors[index];
  }

  onCountryCitySwitch(type) {
    this.geoMapReqOb.dimension = type;
    this.geoTableReqOb.dimension = type;
    if (type === 'country')
      this.name = 'Country';
    else
      this.name = 'City';

    this.getTableData();
    this.getMapData();
  }
}

