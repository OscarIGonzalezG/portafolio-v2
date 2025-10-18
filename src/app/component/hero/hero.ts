import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class Hero {
  buttons = [
    { label: 'Ver Proyectos', href: '#projects', icon: 'folder.svg' },
    { label: 'Solicita tu sitio', href: '#contact', icon: 'email.svg' }
  ];
}
