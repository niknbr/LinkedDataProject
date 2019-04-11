import { Component, OnInit } from '@angular/core';
import { NobelPrizeService } from 'src/app/services/nobel.prize.service';
import { DbpediaService } from 'src/app/services/dbpedia.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  categories: any;
  selected: any = {
    category: ''
  }
  response:any;

  constructor(private dbpediaService: DbpediaService,
    private nobelPrizeService: NobelPrizeService) {

  }

  ngOnInit() {
    this.nobelPrizeService.getCategories().subscribe((data) => {
      this.categories = data;
      this.selected.category = this.categories[0];
    })

    // this.nobelPrizeService.getLocalCategories().subscribe((data)=>{
    //   this.response = data;
    // })
  }

}
