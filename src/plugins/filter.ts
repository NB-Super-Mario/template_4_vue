import Vue from 'vue';
import * as filters from '../utils/filters';

type Filters = { [key: string]: string };
const newFilters = <Filters>(<any>filters);
Object.keys(filters).forEach(key => {
  const filter: any = newFilters[key];
  Vue.filter(key, filter);
});
