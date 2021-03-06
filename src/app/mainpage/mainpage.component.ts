import {
  Component,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css'],
})
export class MainpageComponent implements OnInit {
  imageSrc: string;
  isLoaded: boolean;
  constructor() {
    this.isLoaded = false;
    this.imageSrc = 'assets/images/dashboard.png';
  }

  ngOnInit() { }
}
