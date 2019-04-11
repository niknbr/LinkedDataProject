import { Component, OnInit } from '@angular/core';
import { DbpediaService } from 'src/app/services/dbpedia.service';
import { NobelPrizeService } from 'src/app/services/nobel.prize.service';

@Component({
  selector: 'app-query-runner',
  templateUrl: './query-runner.component.html',
  styleUrls: ['./query-runner.component.css']
})
export class QueryRunnerComponent implements OnInit {
  response:any;
  query:string;
  

  constructor(private dbpediaService: DbpediaService,
    private nobelPrizeService: NobelPrizeService) {

  }

  ngOnInit() {
   this.query = `SELECT DISTINCT ?p where { ?s ?p ?o }`;
 
   this.nobelPrizeService.runQuery(this.query).subscribe((data)=>{
      this.response = data;
    })
  }

  fetchData(query:string){
    this.nobelPrizeService.runQuery(query).subscribe((data)=>{
      this.response = data;
    })
  }
}
