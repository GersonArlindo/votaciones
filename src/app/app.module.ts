import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { NavmenuComponent } from './components/navmenu/navmenu.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { QRCodeModule } from 'angularx-qrcode';
import { LeerQrComponent } from './components/leer-qr/leer-qr.component';
import { NgQrScannerModule } from 'angular2-qrscanner';
import { VotacionComponent } from './components/votacion/votacion.component';

@NgModule({
  declarations: [
    
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavmenuComponent,
    PageNotFoundComponent,
    LeerQrComponent,
    VotacionComponent
  ],
  imports: [
    QRCodeModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgQrScannerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
