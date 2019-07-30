import { Injectable } from '@angular/core';
import { SmartTableData } from '../data/smart-table';

@Injectable()
export class SmartTableService extends SmartTableData {

  data = [{
    id: 1,
    campaignName: 'Mark',
    status: 'Otto',
    openRate: '@mdo',
    lastUpdated: 'mdo@gmail.com',
  }, {
    id: 2,
    campaignName: 'Jacob',
    status: 'Thornton',
    openRate: '@fat',
    lastUpdated: 'fat@yandex.ru',
  }, {
    id: 3,
    campaignName: 'Larry',
    status: 'Bird',
    openRate: '@twitter',
    lastUpdated: 'twitter@outlook.com',
  }, {
    id: 4,
    campaignName: 'John',
    status: 'Snow',
    openRate: '@snow',
    lastUpdated: 'snow@gmail.com',
  }, {
    id: 5,
    campaignName: 'Jack',
    status: 'Sparrow',
    openRate: '@jack',
    lastUpdated: 'jack@yandex.ru',
  }, {
    id: 6,
    campaignName: 'Ann',
    status: 'Smith',
    openRate: '@ann',
    lastUpdated: 'ann@gmail.com',
  }, {
    id: 7,
    campaignName: 'Barbara',
    status: 'Black',
    openRate: '@barbara',
    lastUpdated: 'barbara@yandex.ru',
  }, {
    id: 8,
    campaignName: 'Sevan',
    status: 'Bagrat',
    openRate: '@sevan',
    lastUpdated: 'sevan@outlook.com',
  }, {
    id: 9,
    campaignName: 'Ruben',
    status: 'Vardan',
    openRate: '@ruben',
    lastUpdated: 'ruben@gmail.com',
  }, {
    id: 10,
    campaignName: 'Karen',
    status: 'Sevan',
    openRate: '@karen',
    lastUpdated: 'karen@yandex.ru',
  }, {
    id: 11,
    campaignName: 'Mark',
    status: 'Otto',
    openRate: '@mark',
    lastUpdated: 'mark@gmail.com',
  }, {
    id: 12,
    campaignName: 'Jacob',
    status: 'Thornton',
    openRate: '@jacob',
    lastUpdated: 'jacob@yandex.ru',
  }, {
    id: 13,
    campaignName: 'Haik',
    status: 'Hakob',
    openRate: '@haik',
    lastUpdated: 'haik@outlook.com',
  }, {
    id: 14,
    campaignName: 'Garegin',
    status: 'Jirair',
    openRate: '@garegin',
    lastUpdated: 'garegin@gmail.com',
  }, {
    id: 15,
    campaignName: 'Krikor',
    status: 'Bedros',
    openRate: '@krikor',
    lastUpdated: 'krikor@yandex.ru',
  }];

  getData() {
    return this.data;
  }
}
