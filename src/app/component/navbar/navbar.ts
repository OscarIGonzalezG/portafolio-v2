import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  isMenuOpen = false;

  menuLinks = [
    { label: 'Inicio', id: 'hero' },
    { label: 'Sobre mí', id: 'about' },
    { label: 'Experiencia', id: 'experience' },
    { label: 'Habilidades', id: 'skills' },
    { label: 'Proyectos', id: 'projects' },
    { label: 'Contacto', id: 'contact' }
  ];

  // Gradiente inicial centrado, más visible
  lightGradient = 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.85) 80%)';

  constructor(private router: Router) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;

    if (!this.isMenuOpen) {
      // reset a centro al cerrar
      this.lightGradient = 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.85) 80%)';
    }
  }

  scrollTo(sectionId: string) {
    this.router.navigate(['/']).then(() => {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    });
  }

  updateLight(event: MouseEvent | TouchEvent) {
    let x = 50;
    let y = 50;

    if (event instanceof MouseEvent) {
      x = (event.clientX / window.innerWidth) * 100;
      y = (event.clientY / window.innerHeight) * 100;
    } else if (event instanceof TouchEvent) {
      x = (event.touches[0].clientX / window.innerWidth) * 100;
      y = (event.touches[0].clientY / window.innerHeight) * 100;
    }

    // Gradiente más visible tipo linterna
    this.lightGradient = `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.25) 0%, rgba(0,0,0,0.85) 80%)`;
  }
}
