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
  data: any;

  selected: any = {
    category: 'All',
    year: 1990
  }
  response: any;

  constructor(private dbpediaService: DbpediaService,
    private nobelPrizeService: NobelPrizeService) {

  }

  ngOnInit() {
    this.nobelPrizeService.getCategories().subscribe((data) => {
      data.unshift({ label: 'All', value: 'All' });
      this.categories = data;
      this.selected.category = this.categories[0];
    })

    // this.nobelPrizeService.getLocalCategories().subscribe((data)=>{
    //   this.response = data;
    // })

    this.fetchData(this.selected);
  }

  fetchData(selectedData) {
    this.data = null;
    this.nobelPrizeService.getData(selectedData.category.value, selectedData.year).subscribe((data) => {
      this.data = data;
    })
  }

}
