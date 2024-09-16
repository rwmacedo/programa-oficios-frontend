import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OficioService } from '../services/oficio.service';

@Component({
  selector: 'app-oficio-pdf-viewer',
  templateUrl: './oficio-pdf-viewer.component.html',
  styleUrls: []
})
export class OficioPdfViewerComponent implements OnInit {

  pdfUrl: string = '';
  isLoading: boolean = true;  // Flag para mostrar o status de carregamento

  constructor(
    private route: ActivatedRoute,
    private oficioService: OficioService
  ) {}

  ngOnInit(): void {
    const fileName = this.route.snapshot.paramMap.get('fileName')!;  // Agora buscamos o fileName
    this.loadPdf(fileName);
  }

  loadPdf(fileName: string) {
    this.oficioService.getPdfUrl(fileName).subscribe((blob: Blob) => {
      console.log('Tipo de arquivo retornado:', blob.type);
      console.log('Tamanho do Blob:', blob.size);
  
      // Para depurar, você pode tentar ler o conteúdo do Blob como texto
      blob.text().then(content => console.log('Conteúdo retornado:', content));
  
      const fileURL = URL.createObjectURL(blob);
      this.pdfUrl = fileURL;
      this.isLoading = false;
    }, error => {
      console.error('Erro ao carregar o PDF', error);
      this.isLoading = false;
    });
  }
  
}
