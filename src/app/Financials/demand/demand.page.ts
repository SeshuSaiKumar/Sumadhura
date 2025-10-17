import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/common.service';

@Component({
  selector: 'app-demand',
  templateUrl: './demand.page.html',
  styleUrls: ['./demand.page.scss'],
})
export class DemandPage implements OnInit {
  @ViewChild('fromDatePicker', { static: false }) fromDatePicker: any;
  @ViewChild('toDatePicker', { static: false }) toDatePicker: any;
 fromDate: string | null;
toDate: string | null;
  showFromDatePicker: boolean = false;
  showToDatePicker: boolean = false;
  selectedFilter = 1;
  
    selectedFromDate: string|number|Date;
  selectedToDate:  string|number|Date;
  tempSelectedDate: string = '';
  demandNotes = [
    { number: 'DN15246225SS', date: '2024-10-24' },
    { number: 'DN15246225SS', date: '2024-10-24' },
    { number: 'DN15246225SS', date: '2024-10-24' },
    { number: 'DN15246225SS', date: '2024-10-24' },
    { number: 'DN15246225SS', date: '2024-10-24' },
        { number: 'DN15246225SS', date: '2024-10-24' },
          { number: 'DN15246225SS', date: '2024-10-24' },
    { number: 'DN15246225SS', date: '2024-10-24' },
    { number: 'DN15246225SS', date: '2024-10-24' },
    { number: 'DN15246225SS', date: '2024-10-24' },
    { number: 'DN15246225SS', date: '2024-10-24' },

  ];


  constructor(public common: CommonService) { 
 }

  ngOnInit() {
  }

selectQuickFilter(months: number) {
    this.selectedFilter = months;
    // You can auto-set dates here if needed
  }

  
// Toggle From Date Picker
toggleFromDatePicker() {
  // this.showFromDatePicker = !this.showFromDatePicker; // Toggle visibility
  this.showToDatePicker = false; // Ensure To Date picker is closed
  this.fromDatePicker.present()

}

// Toggle To Date Picker
toggleToDatePicker() {
  // this.showToDatePicker = !this.showToDatePicker; // Toggle visibility
  this.showFromDatePicker = false; // Ensure From Date picker is closed
  this.toDatePicker.present()
}

// Update From Date
updateFromDate(event: any) {
  this.selectedFromDate = event.detail.value;

  this.showFromDatePicker = false; // Close the picker after selection

  // if (!this.selectedToDate) {
  //   this.selectedToDate = this.selectedFromDate; // Default To Date to From Date
  // }

  if (this.selectedToDate && new Date(this.selectedFromDate) > new Date(this.selectedToDate)) {
    this.common.presentAlert('From Date cannot be later than To Date');
    this.selectedFromDate = '';
    this.selectedToDate = '';
  } else {
  }
}

// Update To Date
updateToDate(event: any) {
  this.selectedToDate = event.detail.value;

  this.showToDatePicker = false; // Close the picker after selection

  if (this.selectedFromDate && new Date(this.selectedFromDate) > new Date(this.selectedToDate)) {
    this.common.presentAlert('From Date cannot be later than To Date');
    this.selectedFromDate = '';
    this.selectedToDate = '';
  } else {
  }
}
}
