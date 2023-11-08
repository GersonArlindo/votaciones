import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DestinoSufragioService } from 'src/app/core/services/destino-sufragio.service';
import { PersonaNaturalService } from 'src/app/core/services/persona-natural.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

  @ViewChild('duiInput') duiInput!: ElementRef;
  CodeGenerado: boolean = false
  uui: any
  formVerificarDui!: FormGroup
  url: SafeUrl = ''
  //public personasNaturales: any = []
  public dui: any

  public token: any
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private generarQrSrv: DestinoSufragioService,
    private personNaturalSrv: PersonaNaturalService
  ){
    this.formVerificarDui = formBuilder.group({
      dui: ['', Validators.required]
    })

  }
  ngOnInit(){
    const token = localStorage.getItem("login-token");
    if (!token) {
      this.router.navigate(['/login'])
    }
  }

  public verificarDui() {
    const dui = {
      dui: this.formVerificarDui.value.dui
    }
    this.generarQrSrv.createQR(dui.dui, this.token)
    .subscribe(
      (res: any) => {
        if(res){
          this.personNaturalSrv.getPersonaNaturalById(res.id_persona_natural)
          .subscribe((data: any) => {
            console.log(data)
            this.dui = data.dui
            this.CodeGenerado = true
            console.log(this.dui)
            this.uui = data.dui
            localStorage.setItem("uui", this.uui);
            console.log('Respuesta de la creación del QR', res);
          })
          Swal.fire(
            'Buen Trabajo!',
            'Su informacion ha sido validada!',
            'success'
          )
        }

        // Aquí puedes manejar la respuesta exitosa.
      },
      (error) => {
        if (error) {
          if(error == "Votante ya ingreso a centro de votacion!"){
            this.CodeGenerado = true
            this.uui = dui.dui
          }
          // Handle the 404 error here
          const errorMessage = error || 'Ha ocurrido un error, usted no esta apto para votar en estas elecciones!';
          console.error('Error 404: Recurso no encontrado', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: errorMessage
          })
          // Puedes tomar medidas específicas para manejar el error 404, como mostrar un mensaje al usuario.
        } else {
          // Handle other errors
          console.error('Error en la creación del QR', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Ha ocurrido un error al momento de crear tu QR!`
          })
          // Puedes manejar otros tipos de errores aquí.
        }
      }
    );
    //this.CodeGenerado = true
  }

  public onInputChange(event: Event) {
    const inputElement = this.duiInput.nativeElement as HTMLInputElement;
    const inputValue = inputElement.value;
  
    // Utilizar una expresión regular para permitir solo números y "-"
    const validValue = inputValue.replace(/[^\d-]/g, '');
  
    // Asignar el valor válido de vuelta al campo de entrada
    inputElement.value = validValue;
  }

  onCodeChange(url: SafeUrl) {
    this.url = url;
  }
  
  regresarGenerar(){
    localStorage.removeItem("uui");
    this.CodeGenerado = false
  }

  getUserInfo(inf: any) {
    const token = this.getTokens();
    this.token = token
    let payload;
    if (token) {
      payload = token.split(".")[1];
      payload = window.atob(payload);
      return JSON.parse(payload)[`${inf}`];
    } else {
      return null;
    }
  }

  getTokens() {
    return localStorage.getItem("login-token");
  }

  nombres: any = this.getUserInfo('nombres'); 
}
