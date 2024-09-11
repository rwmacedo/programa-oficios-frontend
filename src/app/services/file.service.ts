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
    // Construa a URL corretamente e passe apenas o nome do arquivo
    return this.http.get(`https://localhost:7163/api/files/download/${fileName}`, {
      responseType: 'blob'  // Para garantir que a resposta seja tratada como um Blob
    });
  }
}

