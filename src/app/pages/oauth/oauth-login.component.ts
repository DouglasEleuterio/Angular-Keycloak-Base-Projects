import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-oauth-login',
  template: '<div>Redirecionando para a tela de login...</div>'
})
export class OAuthLoginComponent implements OnInit {
  constructor(private route: ActivatedRoute, private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.authenticationService.autorize();
  }
}
