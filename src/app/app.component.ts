import { Component, OnInit } from '@angular/core';
import { DbpediaService } from './services/dbpedia.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  response:any;
  query:string;

  constructor(private dbpediaService: DbpediaService) {

  }

  ngOnInit() {
    this.query = `
      PREFIX dbo: <http://dbpedia.org/ontology/>
      SELECT ?album ?artist WHERE {
      ?album dbo:artist ?artist .
      } LIMIT 10`;
    this.dbpediaService.getData(this.query).subscribe((data)=>{
      this.response = data;
    })
  }

  fetchData(query:string){
    this.dbpediaService.getData(query).subscribe((data)=>{
      this.response = data;
    })
  }
}
