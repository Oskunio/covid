import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class WebService {
  readonly url = 'https://covid-193.p.rapidapi.com';
  readonly apiKey = 'e6adefbf45msh51ec4575918a3cep13ada8jsnbb0477408001';
  constructor(private http: HttpClient) { }

  getStatitics() {

    return this.http.get(`${this.url}/statistics`,{ headers: new HttpHeaders().set('x-rapidapi-key', this.apiKey)});
  }

}
