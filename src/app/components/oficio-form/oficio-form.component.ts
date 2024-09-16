import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OficioService } from '../../services/oficio.service';
import { Oficio } from '../../models/oficio';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FileUploadService } from '../../services/file-upload.service';  
import { FileService } from '../../services/file.service'; 
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-oficio-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './oficio-form.component.html',
  styleUrls: ['./oficio-form.component.css'],
  providers: [DatePipe] // Providenciando o DatePipe
})
export class OficioFormComponent {

  oficio: Oficio = {
    id: 0,
    numero: '',
    ano: new Date().getFullYear(),
    unidade: '',
    data: new Date(),
    arquivoUrl: ''
  };

  selectedFile: File | null = null;
  fileError: string | null = null;  // Para exibir erro do arquivo
  dateError: string | null = null;  // Para exibir erro de data

  constructor(
    private oficioService: OficioService,
    private route: ActivatedRoute,
    private router: Router,
    private fileUploadService: FileUploadService,  
    private fileService: FileService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.oficioService.getOficio(Number(id)).subscribe(data => {
        this.oficio = data;
        // Converte a data para o formato YYYY-MM-DD, que o input[type="date"] aceita
        if (this.oficio.data) {
          this.oficio.data = this.datePipe.transform(new Date(this.oficio.data), 'yyyy-MM-dd') as any;
        }
      });
    }
  }

  // Validação para garantir que a data não seja futura
  isDateValid(): boolean {
    const currentDate = new Date();
    const selectedDate = new Date(this.oficio.data as any);
    return selectedDate <= currentDate;  // A data deve ser menor ou igual à data atual
  }

  // Função para capturar o arquivo selecionado
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    
    // Verificar se o arquivo é PDF
    if (file.type !== 'application/pdf') {
      this.fileError = 'Por favor, selecione um arquivo no formato PDF.';
      this.selectedFile = null;
    } else {
      this.selectedFile = file;
      this.fileError = null;  // Limpa o erro se o arquivo for válido
    }
  }

  // Função para salvar o ofício
  saveOficio() {
    // Valida a data antes de continuar
    if (!this.isDateValid()) {
      this.dateError = 'A data não pode ser futura.';  // Define a mensagem de erro
      return;  // Interrompe o processo de salvamento
    } else {
      this.dateError = null;  // Limpa a mensagem de erro se a data for válida
    }

    if (this.oficio.data) {
      // Verifica se o Kind da data é "Unspecified" e converte para UTC
      const data = new Date(this.oficio.data);
      if (data.getTimezoneOffset() !== 0) {
        this.oficio.data = new Date(data.getTime() - (data.getTimezoneOffset() * 60000));  // Converte para UTC
      }
    }

    if (this.selectedFile) {
      // Se um arquivo foi selecionado, faz o upload
      this.fileUploadService.uploadFile(this.selectedFile).subscribe(
        (response) => {
          this.oficio.arquivoUrl = response.url;  // Associa a URL do arquivo ao ofício
          this.persistOficio();  // Salva o ofício com a URL do arquivo
        },
        (error) => {
          console.error('Erro no upload:', error);
        }
      );
    } else if (!this.fileError) {  // Apenas salva o ofício se não houver erro de arquivo
      this.persistOficio();
    }
  }

  // Função auxiliar para salvar ou atualizar o ofício
  persistOficio() {
    if (this.oficio.id) {
      this.oficioService.updateOficio(this.oficio.id, this.oficio).subscribe(() => {
        this.router.navigate(['/']);
      });
    } else {
      this.oficioService.createOficio(this.oficio).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }

  // Função para redirecionar à página inicial
  goBack() {
    this.router.navigate(['/']);
  }

  // Função para download de arquivos
  downloadFile(fileName: string): void {
    this.fileService.downloadFile(fileName).subscribe(response => {
      const blob = new Blob([response], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Erro ao fazer o download do arquivo', error);
    });
  }
}
