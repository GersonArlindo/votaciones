import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DestinoSufragioService } from 'src/app/core/services/destino-sufragio.service';
import { PartidosPoliticosService } from 'src/app/core/services/partidos-politicos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-votacion',
  templateUrl: './votacion.component.html',
  styleUrls: ['./votacion.component.scss']
})
export class VotacionComponent implements OnInit {

public token: any
public partidos_politicos: any = []
partidosEstado: { [key: string]: boolean } = {};
public duiVotante: any
public IdPartido: any
constructor(
  private router: Router,
  private partidosPoliticoSrv: PartidosPoliticosService,
  private destinoSufragioSrv: DestinoSufragioService
){}

ngOnInit(){
  const token = localStorage.getItem("login-token");
  this.duiVotante = localStorage.getItem("miDui")
  if (!token || !this.duiVotante) {
    this.router.navigate(['/leer-qr'])
  }

  this.getPartidosPoliticos()

}

seleccionarPartido(idPartido: number, nombre_partido: any, id_candidato: any) {
  console.log(idPartido)
  for (let partido of this.partidos_politicos) {
    this.partidosEstado[partido.id_partido_politico] = false;
  }
  this.partidosEstado[idPartido] = !this.partidosEstado[idPartido];
  Swal.fire({
    title: `Deseas votar por el partido ${nombre_partido}?`,
    text: "Esta accion NO SE PUEDE REVERTIR!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "VOTAR"
  }).then((result) => {
    if (result.isConfirmed) {
      this.destinoSufragioSrv.emitirVoto(this.duiVotante, this.duiVotante, id_candidato, this.token)
        .subscribe((res: any) => {
          if(res){
            Swal.fire({
              title: "Exito!",
              text: "Su voto ha sido emitido exitosamente!",
              icon: "success"
            });
            localStorage.removeItem("miDui")
            setTimeout(() => {
              this.router.navigate(['/leer-qr']);
            }, 2000);
          }
        },
        (error) => {
          console.error(error); // Imprime el error en la consola
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error // Muestra el mensaje de error
          });
          return
        }
      )
    }
  });
}

public getPartidosPoliticos() {
  this.partidosPoliticoSrv.getPartidosPoliticos(this.token)
    .subscribe((data: any) => {
      for (let partido of data) {
        this.partidos_politicos.push(partido);
        this.partidosEstado[partido.id_partido_politico] = false; // Inicializa el estado del partido
      }
      console.log(this.partidos_politicos);
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
