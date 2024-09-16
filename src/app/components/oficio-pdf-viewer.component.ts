import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OficioService } from '../services/oficio.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FileService } from '../services/file.service';

@Component({
  selector: 'app-oficio-pdf-viewer',
  templateUrl: './oficio-pdf-viewer.component.html',
  styleUrls: ['./oficio-pdf-viewer.component.css']
})
export class OficioPdfViewerComponent implements OnInit {

  pdfUrl: SafeResourceUrl = '';  // Alterado para SafeResourceUrl
  isLoading: boolean = true;  // Flag para mostrar o status de carregamento
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

  // Função para carregar o PDF e abrir em nova aba
  loadPdf(fileName:string): void {
    this.fileService.getPdf(fileName).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    });
  }

  // Função para redirecionar à página inicial
  goBack() {
    this.router.navigate(['/']);
  }
}
