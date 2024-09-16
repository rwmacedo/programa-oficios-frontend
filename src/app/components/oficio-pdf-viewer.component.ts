import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OficioService } from '../services/oficio.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FileService } from '../services/file.service';
import * as pdfjsLib from 'pdfjs-dist';

@Component({
  selector: 'app-oficio-pdf-viewer',
  templateUrl: './oficio-pdf-viewer.component.html',
  styleUrls: ['./oficio-pdf-viewer.component.css']
})
export class OficioPdfViewerComponent implements OnInit {
  
  @ViewChild('pdfViewer', { static: true }) pdfViewer!: ElementRef; // MOVIDO para fora do ngOnInit

  pdfUrl: SafeResourceUrl = '';
  isLoading: boolean = true;
  numero: string = '';
  unidade: string = '';
  ano: string = '';

  constructor(
    private route: ActivatedRoute,
    private oficioService: OficioService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    // Captura os dados do state ao navegar
    const state = history.state as { numero: string, unidade: string, ano: string };

    if (state && state.numero && state.unidade && state.ano) {
      this.numero = state.numero;
      this.unidade = state.unidade;
      this.ano = state.ano;
    } else {
      console.error('Nenhum dado de ofício encontrado no state.');
    }

    const fileName = this.route.snapshot.paramMap.get('fileName')!;  // Agora buscamos o fileName
    this.loadPdf(fileName);
  }

  loadPdf(fileName: string): void {
    this.fileService.getPdf(fileName).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const loadingTask = pdfjsLib.getDocument(url);

      loadingTask.promise.then(pdf => {
        pdf.getPage(1).then(page => {
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas: HTMLCanvasElement = this.pdfViewer.nativeElement;
          const context = canvas.getContext('2d')!;
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          page.render(renderContext);
        });
      });
    });
  }

  // Função para redirecionar à página inicial
  goBack() {
    this.router.navigate(['/']);
  }
}
