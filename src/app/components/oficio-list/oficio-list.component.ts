import { Component, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OficioService } from '../../services/oficio.service';
import { Oficio } from '../../models/oficio';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FileService } from '../../services/file.service';
import { firstValueFrom } from 'rxjs';
import { NgxDatatableModule } from '@swimlane/ngx-datatable'; // Importação do ngx-datatable
import { FormsModule } from '@angular/forms'; // Importar o FormsModule para ngModel

@Component({
  selector: 'app-oficio-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxDatatableModule, FormsModule], // Adicionando NgxDatatable e FormsModule
  templateUrl: './oficio-list.component.html',
  styleUrls: ['./oficio-list.component.css'],
  providers: [DatePipe]
})
export class OficioListComponent {

  oficios: Oficio[] = [];
  filteredOficios: Oficio[] = []; // Para armazenar os ofícios filtrados
  searchTerm: string = ''; // Termo de pesquisa
  selectedAno: string = ''; // Filtro por ano
  selectedUnidade: string = ''; // Filtro por unidade
  anosDisponiveis: string[] = []; // Anos disponíveis para filtrar
  unidadesDisponiveis: string[] = []; // Unidades disponíveis para filtrar
  pageSize: number = 5; // Número de linhas por página
  pageOffset: number = 0; // Página atual
  pageSizes: number[] = [5, 10, 20, 50]; // Opções de número de linhas por página
  totalRows: number = 0;
  currentPage: number = 0;

  columns = [
    { name: 'ID', prop: 'id' },
    { name: 'Número', prop: 'numero' },
    { name: 'Ano', prop: 'ano' },
    { name: 'Unidade', prop: 'unidade' },
    { name: 'Data', prop: 'data' },
    { name: 'Ações', prop: 'actions' }
  ];

  constructor(
    private oficioService: OficioService,
    private http: HttpClient,
    private fileService: FileService, // Injeção correta do FileService
    public datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.loadOficios();
  }

  loadOficios() {
    this.oficioService.getOficios().subscribe(
      data => {
        this.oficios = data;
        this.filteredOficios = [...this.oficios]; // Inicialmente, todos os ofícios são mostrados
        this.anosDisponiveis = [...new Set(this.oficios.map(oficio => oficio.ano.toString()))]; // Anos únicos como strings
        this.unidadesDisponiveis = [...new Set(this.oficios.map(oficio => oficio.unidade))]; // Unidades únicas
        this.totalRows = this.filteredOficios.length;
      },
      error => console.error('Erro ao carregar os ofícios', error) // Mensagem de erro mais descritiva
    );
  }

  // Filtrar os ofícios com base no termo de pesquisa, ano, e unidade
  filterOficios() {
    this.filteredOficios = this.oficios.filter((oficio) => {
      const matchesNumero = this.searchTerm ? 
        oficio.numero.toLowerCase().includes(this.searchTerm.toLowerCase()) : true;
  
      const matchesAno = this.selectedAno ? 
        oficio.ano.toString() === this.selectedAno.toString() : true;
  
      const matchesUnidade = this.selectedUnidade ? 
        oficio.unidade.toLowerCase().includes(this.selectedUnidade.toLowerCase()) : true;
  
      return matchesNumero && matchesAno && matchesUnidade;
    });
  }

  // Paginação - Trocar de página
  onPage(event: any) {
    this.pageOffset = event.offset;
  }

  // Mudar o número de linhas por página
  onPageSizeChange(newPageSize: number) {
    this.pageSize = newPageSize;
    this.pageOffset = 0; // Voltar para a primeira página
  }

  // Funções de Paginação
  goToFirstPage() {
    this.pageOffset = 0;
  }

  goToPreviousPage() {
    if (this.pageOffset > 0) {
      this.pageOffset--;
    }
  }

  goToNextPage() {
    if (!this.isLastPage()) {
      this.pageOffset++;
    }
  }

  goToLastPage() {
    this.pageOffset = Math.ceil(this.filteredOficios.length / this.pageSize) - 1;
  }

  isLastPage() {
    return this.pageOffset >= Math.ceil(this.totalRows / this.pageSize) - 1;
  }

  getPages(): number[] {
    const totalPages = Math.ceil(this.filteredOficios.length / this.pageSize);
    return Array(totalPages).fill(0).map((x, i) => i);
  }

  goToPage(page: number) {
    this.pageOffset = page;
    this.currentPage = page;
  }

  deleteOficio(id: number) {
    this.oficioService.deleteOficio(id).subscribe(() => {
      this.loadOficios(); // Recarrega a lista após deletar
    }, error => {
      console.error('Erro ao excluir o ofício', error); // Tratamento de erro ao excluir
    });
  }

  async downloadFile(fileUrl: string): Promise<void> {
    try {
      // Extraia o nome do arquivo da URL completa
      const fileName = this.getFileNameFromUrl(fileUrl);  // Supondo que fileUrl seja algo como 'https://.../OFICIO0001.pdf'
      
      // Faz a solicitação para o endpoint de download, passando apenas o nome do arquivo
      const response = await firstValueFrom(this.fileService.downloadFile(fileName));
      
      // Cria um blob para baixar o arquivo
      const blob = new Blob([response], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      
      // Cria um link temporário para forçar o download do arquivo
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      
      // Libera o objeto URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao fazer o download do arquivo', error);
    }
  }

  getFileNameFromUrl(url: string): string {
    return url.substring(url.lastIndexOf('/') + 1);  // Extrai o nome do arquivo da URL completa
  }
}
