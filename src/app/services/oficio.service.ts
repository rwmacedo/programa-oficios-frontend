import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Oficio } from '../models/oficio';  
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OficioService {

  private apiUrl = environment.apiURL + '/Oficios'; // URL da API criada no backend
  

  constructor(private http: HttpClient) { }
  
// Método para buscar o arquivo PDF do backend pelo ID
getPdfUrl(fileName: string): Observable<Blob> {
  return this.http.get(`${this.apiUrl}/Files/download/${fileName}`, { responseType: 'blob' });
}

  // Método para listar todos os ofícios
  getOficios(): Observable<Oficio[]> {
    return this.http.get<Oficio[]>(this.apiUrl);
  }

  // Método para obter um ofício pelo ID
  getOficio(id: number): Observable<Oficio> {
    return this.http.get<Oficio>(`${this.apiUrl}/${id}`);
  }

  // Método para criar um novo ofício
  createOficio(oficio: Oficio): Observable<Oficio> {
    return this.http.post<Oficio>(this.apiUrl, oficio);
  }

  // Método para atualizar um ofício existente
  updateOficio(id: number, oficio: Oficio): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, oficio);
  }

  // Método para deletar um ofício
  deleteOficio(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}