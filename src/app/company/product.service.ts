import { Injectable } from '@angular/core';
import { Subject, Observable , BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private subject = new Subject<any>();


  
notification_sendNumber(number: number) {
  this.subject.next({ count: number });
}

  getNumber():Observable<any>{
    return this.subject.asObservable();
  }

  constructor() { 
   
  }
}
