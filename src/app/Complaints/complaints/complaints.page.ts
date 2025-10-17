import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.page.html',
  styleUrls: ['./complaints.page.scss'],
})
export class ComplaintsPage implements OnInit {
segment = 'myComplaints';

  constructor() { }

  ngOnInit() {
  }

  complaints = [
    {
      no: 403,
      raised: '10/06/2025',
      escalates: '12/06/2025',
      status: 'Open',
      statusClass: 'status-open'
    },
    {
      no: 398,
      raised: '22/05/2025',
      escalates: '24/05/2025',
      status: 'Inprogress',
      statusClass: 'status-inprogress'
    }
  ];
}


