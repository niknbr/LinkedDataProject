import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { NgxXml2jsonService } from 'ngx-xml2json';


const prefix = `PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>PREFIX nobel: <http://data.nobelprize.org/terms/>PREFIX foaf: <http://xmlns.com/foaf/0.1/>PREFIX yago: <http://yago-knowledge.org/resource/>PREFIX viaf: <http://viaf.org/viaf/>PREFIX meta: <http://www4.wiwiss.fu-berlin.de/bizer/d2r-server/metadata#>PREFIX dcterms: <http://purl.org/dc/terms/>PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>PREFIX d2r: <http://sites.wiwiss.fu-berlin.de/suhl/bizer/d2r-server/config.rdf#>PREFIX dbpedia: <http://dbpedia.org/resource/>PREFIX owl: <http://www.w3.org/2002/07/owl#>PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>PREFIX map: <http://data.nobelprize.org/resource/#>PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>PREFIX freebase: <http://rdf.freebase.com/ns/>PREFIX dbpprop: <http://dbpedia.org/property/>PREFIX skos: <http://www.w3.org/2004/02/skos/core#>`;


@Injectable({
  providedIn: 'root'
})
export class NobelPrizeService {


  constructor(
    private apiService: ApiService,
    private ngxXml2jsonService: NgxXml2jsonService
  ) { }

  runQuery(query: string): Observable<any> {

    const payload = new HttpParams()
      .set('output', 'json')
      .set('query', prefix + query);

    return this.apiService.post(environment.nobel_prize_url, payload);
  }

  getCategories(): Observable<string> {
    const query = `SELECT DISTINCT ?label ?cat WHERE {
      ?cat rdf:type nobel:Category .
      ?cat rdfs:label ?label .
    } limit 10`;

    const payload = new HttpParams()
      .set('output', 'json')
      .set('query', prefix + query);
      
    return this.apiService.post(environment.nobel_prize_url, payload)
      .pipe(map(response => response.results.bindings
        .map(category => ({ label: category.label.value, value: category.cat.value }))));

    // return this.apiService.get(environment.nobel_prize_url + '?query=' + encodeURIComponent(query) + '&format=json')
    //   .pipe(map(response => response.results.bindings
    //     .map(category => ({ label: category.label.value, value: category.cat.value }))));
  }


  getLocalCategories(): Observable<any> {
    const query = `SELECT DISTINCT ?label ?cat WHERE {
      ?cat rdf:type nobel:Category .
      ?cat rdfs:label ?label .
    } limit 10`;


    return this.apiService
      .get('http://3d30c034.ngrok.io/Nobel/query' + '?query=' + encodeURIComponent(prefix + query))
      .pipe(map(response => this.ngxXml2jsonService.xmlToJson(response)));
  }

}
