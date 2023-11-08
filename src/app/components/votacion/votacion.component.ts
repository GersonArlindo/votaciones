import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-votacion',
  templateUrl: './votacion.component.html',
  styleUrls: ['./votacion.component.scss']
})
export class VotacionComponent implements OnInit {
constructor(
  private router: Router,
){}

ngOnInit(){
  const token = localStorage.getItem("login-token");
  if (!token) {
    this.router.navigate(['/login'])
  }
}
}
