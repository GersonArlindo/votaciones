import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ILogin } from 'src/app/models/ilogin';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formLogin!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private loginSrv: AuthService
  ) {
    this.formLogin = formBuilder.group({
      usuario: ['', Validators.required],
      clave: ['', Validators.required],
    })
  }
  ngOnInit() {

  }

  Login() {
    const usuarioLogin: ILogin = {
      usuario: this.formLogin.value.usuario,
      clave: this.formLogin.value.clave
    }
  
    this.loginSrv.login(usuarioLogin)
      .subscribe(
        (res: any) => {
          if (res.access_token) {
            console.log("Token de acceso:", res.access_token);
            this.router.navigate(['/home'])
          } else {
            // En caso de error, muestra una alerta
            alert("Hubo un error en la respuesta");
          }
        },
        (error) => {
          // En caso de error en la solicitud, muestra una alerta con el mensaje de error
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Usuario o Contraseña incorrectos!'
          })
        }
      );
  }
}
