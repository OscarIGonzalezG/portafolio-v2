import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import socialsData from '../../../assets/data/socials.json';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class Hero {
  socials = socialsData;

  buttons = [
    {
      label: 'Ver Proyectos',
      href: '#projects',
      icon: 'folder.svg'
    },
    {
      label: 'Descargar CV',
      href: 'assets/CV_OscarGonzalez.pdf',
      icon: 'cv.svg',
      download: true
    },
    {
      label: 'Contáctame',
      href: '#contact',
      icon: 'email.svg'
    }
  ];
}
