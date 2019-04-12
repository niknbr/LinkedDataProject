import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { HttpParamsOptions } from '@angular/common/http/src/params';


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

  getCategories(): Observable<any[]> {
    const query = `SELECT DISTINCT ?label ?cat WHERE {
      ?cat rdf:type nobel:Category .
      ?cat rdfs:label ?label .
    } limit 10`;

    const payload = new HttpParams()
      .set('output', 'json')
      .set('query', prefix + query);

    // return this.apiService.post(environment.nobel_prize_url, payload)
    return this.apiService.get(environment.nobel_prize_url + '?query=' +
      encodeURIComponent(prefix + query) + '&format=json')
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

  getData(subject = 'All', year = 2018): Observable<any> {

    const subjectFilter = subject != 'All' ? `FILTER (?nobCategory = <${subject}>)` : ``;
    // FILTER (REGEX(?Category, "Physics"))

    const query = `
    PREFIX nobelTerms: <http://data.nobelprize.org/terms/>
    PREFIX nobelResource: <http://data.nobelprize.org/resource/>
    PREFIX dbpo: <http://dbpedia.org/ontology/>
    PREFIX dbp: <http://dbpedia.org/property/>

    SELECT DISTINCT ?Category ?PersonName ?Year ?BirthDay ?BirthPlace ?DeathDay ?Gender ?Nationality ?Thumbnail ?sameAs WHERE {
      ?laur nobelTerms:laureateAward ?laureateAward .
      ?laureateAward nobelTerms:category ?nobCategory .
      ?laureateAward nobelTerms:year ?Year.
      ?nobCategory rdfs:label ?Category .
      ?laur foaf:name ?PersonName .
      ?laur foaf:birthday ?BirthDay .
      ?laur foaf:gender ?Gender .
      ?laur dbpo:birthPlace ?birthPlace .
      ?birthPlace rdfs:label ?BirthPlace .
            
      OPTIONAL {?laur dbp:dateOfDeath ?DeathDay .}
      ?laur owl:sameAs ?sameAs .
      
      FILTER (REGEX(STR(?sameAs),".dbpedia.")) `+
      subjectFilter +
      `FILTER (?Year = ${year})
      
      SERVICE <http://dbpedia.org/sparql> { 
        ?sameAs dbpo:nationality ?Nationality . 
        OPTIONAL {?sameAs dbpo:thumbnail ?Thumbnail .}
      }
      
              
    }
    `;

    // const payload = new HttpParams()
    //   .set('output', 'json')
    //   .set('query', prefix + query);
    // // return this.apiService.post(environment.nobel_prize_url, payload)
    
    const getValue = (item, param) => item[param] ? item[param].value : null;
    return this.apiService.get(environment.nobel_prize_url + '?query=' +
      encodeURIComponent(prefix + query) + '&format=json')
      .pipe(map(response => response.results.bindings.map((item => ({
        category: getValue(item, 'Category'),
        personName: getValue(item, 'PersonName'),
        year: getValue(item, 'Year'),
        birthday: getValue(item, 'BirthDay'),
        deathDay: getValue(item, 'DeathDay'),
        birthPlace: getValue(item, 'BirthPlace'),
        nationality: getValue(item, 'Nationality'),
        thumbnail: getValue(item, 'Thumbnail')
      })))));
  }

}
