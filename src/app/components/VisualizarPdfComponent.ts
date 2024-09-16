import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OficioService } from '../services/oficio.service';
import { Oficio } from '../models/oficio';

@Component({
  selector: 'app-visualizar-pdf',
  templateUrl: './visualizarpdfcomponent.html'
})
export class VisualizarPdfComponent implements OnInit {
  oficioId!: number;

  constructor(private route: ActivatedRoute, private oficioService: OficioService) {}

  ngOnInit(): void { 
    // Pegando o 'oficioId' da URL
    const oficioId = this.route.snapshot.params['oficioId'];
    
    if (oficioId) {
      this.loadPdf(oficioId);  // Passando o 'oficioId' como argumento para o método loadPdf
    } else {
      console.error('Ofício ID não encontrado.');
    }
  }

  loadPdf(oficioId: number): void {  // Mude o tipo para 'number'
    this.oficioService.getPdf(oficioId).subscribe((pdfBlob) => {
      const fileURL = URL.createObjectURL(pdfBlob);
      window.open(fileURL, '_blank');
    }, error => {
      console.error('Erro ao carregar o PDF', error);
    });
  }
}
