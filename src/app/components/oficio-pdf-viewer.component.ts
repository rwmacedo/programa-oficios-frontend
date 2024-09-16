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

  constructor(
    private route: ActivatedRoute,
    private oficioService: OficioService
  ) {}

  ngOnInit(): void {
    const oficioId = +this.route.snapshot.paramMap.get('id')!;
    this.loadPdf(oficioId);
  }

  loadPdf(oficioId: number) {
    this.oficioService.getPdfUrl(oficioId).subscribe((blob: Blob) => {
      const fileURL = URL.createObjectURL(blob);
      this.pdfUrl = fileURL;
    }, error => {
      console.error('Erro ao carregar o PDF', error);
    });
  }
}
