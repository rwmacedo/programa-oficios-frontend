import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private apiUrl = environment.apiURL + '/files'; // API URL base

  constructor(private http: HttpClient) { }

  // Método para realizar o download do arquivo
  downloadFile(fileName: string): Observable<Blob> {
   // Construa a URL corretamente usando a variável apiUrl do environment
   return this.http.get(`${this.apiUrl}/download/${fileName}`, {
    responseType: 'blob'  // Para garantir que a resposta seja tratada como um Blob
  });
}
// Método para buscar o arquivo PDF do backend pelo ID
getPdfUrl(id: number): Observable<Blob> {
  return this.http.get(`${this.apiUrl}/${id}/download`, { responseType: 'blob' });
}
getPdf(): Observable<Blob> {
  return this.http.get(this.apiUrl, { responseType: 'blob' });
}

}


