import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { AppComponent } from './app/app.component';
import { OficioListComponent } from './app/components/oficio-list/oficio-list.component';
import { OficioFormComponent } from './app/components/oficio-form/oficio-form.component';
import { provideHttpClient } from '@angular/common/http';
import { FileUploadComponent } from './app/components/file-upload.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(
      [
        { path: '', component: OficioListComponent },
        { path: 'new', component: OficioFormComponent },
        { path: 'edit/:id', component: OficioFormComponent },
        { path: 'upload', component: FileUploadComponent },
      ],
    ),
    provideHttpClient()  // Provedor para fazer requisições HTTP
  ]
});
imports: [
  BrowserAnimationsModule,
  ToastrModule.forRoot({
    positionClass: 'toast-top-right',
    closeButton: true,
  }),
]
