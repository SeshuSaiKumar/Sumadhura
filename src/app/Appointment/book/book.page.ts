import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-book',
  templateUrl: './book.page.html',
  styleUrls: ['./book.page.scss'],
})
export class BookPage implements OnInit {
 selectedSegment: string = 'my';
showModal = false;

  appointments = [
    { date: '2025-05-29', time: '01:00 PM', status: 'Booked',id:"6545" },
    { date: '2025-05-20', time: '08:00 PM', status: 'Booked',id:"6546" },
        { date: '2025-05-20', time: '08:00 PM', status: 'Booked',id:"6547" }

  ];

  booking = {
    appointmentFor: '',
    month: '',
    slotDate: '',
    slotTime: ''
  };

  slotDates = [
    { day: 'WED', date: '1' }, { day: 'THU', date: '2' }, { day: 'FRI', date: '3' }, { day: 'SAT', date: '4' },
    { day: 'SUN', date: '5' }, { day: 'MON', date: '6' }, { day: 'TUE', date: '7' }
  ];

  slotTimes = ['01:00 PM', '05:00 PM'];



  constructor() { }

  ngOnInit() {
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}
