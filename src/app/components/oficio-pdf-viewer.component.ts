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
      console.log('Tipo de arquivo retornado:', blob.type);  // Logar o tipo de arquivo retornado
  
      // Verifique se o Blob é do tipo PDF
      if (blob.type === 'application/pdf') {
        const fileURL = URL.createObjectURL(blob);
        this.pdfUrl = fileURL;
      } else {
        console.error('O arquivo retornado não é um PDF');
      }
      this.isLoading = false;  // Quando o PDF for carregado, pare de mostrar o status de carregamento
    }, error => {
      console.error('Erro ao carregar o PDF', error);
      this.isLoading = false;  // Pare de mostrar o status de carregamento em caso de erro
    });
  }
}
