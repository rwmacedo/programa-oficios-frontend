import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OficioService } from '../services/oficio.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-oficio-pdf-viewer',
  templateUrl: './oficio-pdf-viewer.component.html',
  styleUrls: []
})
export class OficioPdfViewerComponent implements OnInit {

  pdfUrl: SafeResourceUrl = '';  // Alterado para SafeResourceUrl
  isLoading: boolean = true;  // Flag para mostrar o status de carregamento

  constructor(
    private route: ActivatedRoute,
    private oficioService: OficioService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const fileName = this.route.snapshot.paramMap.get('fileName')!;  // Agora buscamos o fileName
    this.loadPdf(fileName);
  }

  loadPdf(fileName: string) {
    this.oficioService.getPdfUrl(fileName).subscribe((blob: Blob) => {
      console.log('Tipo de arquivo retornado:', blob.type);  // application/pdf
      console.log('Tamanho do Blob:', blob.size);  // Verifique o tamanho do PDF
    
      // Gere a URL do Blob e tente abrir o PDF em uma nova aba
      const fileURL = URL.createObjectURL(blob);
      console.log('URL gerada para o PDF:', fileURL);  // Verifique a URL gerada
      window.open(fileURL);  // Abra o PDF em uma nova aba
      
      this.isLoading = false;  // Quando o PDF for carregado, pare de mostrar o status de carregamento
    }, error => {
      console.error('Erro ao carregar o PDF', error);
      this.isLoading = false;  // Pare de mostrar o status de carregamento em caso de erro
    });
  }
}
