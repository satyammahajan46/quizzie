import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {

  @Input() title: string;
  @Input() subtitle: string;
  @Input() description: string;
  @Input() imageSrc: string;
  constructor() { }

  ngOnInit(): void {
  }

}
