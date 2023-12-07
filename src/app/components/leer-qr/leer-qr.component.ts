import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { QrScannerComponent } from 'angular2-qrscanner';
import { DestinoSufragioService } from 'src/app/core/services/destino-sufragio.service';
import { PersonaNaturalService } from 'src/app/core/services/persona-natural.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-leer-qr',
  templateUrl: './leer-qr.component.html',
  styleUrls: ['./leer-qr.component.scss']
})
export class LeerQrComponent implements OnInit, AfterViewInit {

  public miDui: any
  public token: any

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private destinoSufragioSrv: DestinoSufragioService,
    private personNaturalSrv: PersonaNaturalService
  ){}

  ngOnInit(): void {
    const token = localStorage.getItem("login-token");
    if (!token) {
      this.router.navigate(['/login'])
    }
  }

  @ViewChild(QrScannerComponent, { static: false }) qrScannerComponent!: QrScannerComponent;

  ngAfterViewInit(): void {
    this.qrScannerComponent.getMediaDevices().then(devices => {
      console.log(devices);
      const videoDevices: MediaDeviceInfo[] = [];
      for (const device of devices) {
        if (device.kind.toString() === 'videoinput') {
          videoDevices.push(device);
        }
      }
      if (videoDevices.length > 0) {
        console.log(videoDevices)
        let choosenDev;
        for (const dev of videoDevices) {
          if (dev.label.includes('front')) {
            choosenDev = dev;
            break;
          }
        }
        if (choosenDev) {
          console.log(choosenDev)
          this.qrScannerComponent.chooseCamera.next(choosenDev);
        } else {
          this.qrScannerComponent.chooseCamera.next(videoDevices[1]);
        }
      }
    });

    this.qrScannerComponent.capturedQr.subscribe(result => {
      console.log(result)
      this.miDui = result
      this.destinoSufragioSrv.validarPersonaNatural(this.miDui, this.miDui, this.token)
      .subscribe(
        (res: any) => {
          Swal.fire({
            title: "Éxito!",
            text: "Usuario Validado exitosamente!",
            icon: "success"
          })
          localStorage.setItem("miDui", this.miDui)
          setTimeout(() => {
            this.router.navigate(['/votacion']);
          }, 1500);
        },
        (error) => {
          console.error(error); // Imprime el error en la consola
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error // Muestra el mensaje de error
          })
          setTimeout(() => {
            window.location.reload()
          }, 2000);
          return
        }
      );
    });
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
