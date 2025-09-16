import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchText: string, filterGroup: any): any[] {
    if (!items) { return []; }
    if (!searchText) { return items; }
    return _.filter(items, it => this.filterByOr(it, filterGroup, searchText));
  }

  filterByOr(item: any, filterGroup: any, searchText: string) {
    let flag = false;
    for (let key of filterGroup) {
      switch (typeof item[key]) {
        case 'string': flag = this.filterByString(item, key, searchText);
          break;
        case 'number': flag = this.filterByNumber(item, key, searchText);
          break;
      }
      if (flag) { break; }
    }
    return flag;
  }

  filterByString(item: any, key: any, searchText: string) {
    searchText = searchText.toLowerCase();

    // If the key contains 'DateTime' or is identified as a date field
    if (key.toLowerCase().includes('date')) {
      const formattedDate = this.formatDate(item[key]);
      return formattedDate.includes(searchText);
    }

    return item[key].toLowerCase().includes(searchText);
  }

  filterByNumber(item: any, key: any, searchText: string) {
    const itemValue = item[key].toString(); // Convert number to string
    const searchValue = searchText.toString(); // Ensure searchText is a string
    return itemValue.includes(searchValue); // Perform partial match
  }

  formatDate(dateTime: string): string {
    if (!dateTime) {
      return '';
    }
    const date = new Date(dateTime);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Return in DD/MM/YYYY format
  }
}
