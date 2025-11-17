import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  github: string;
  demo: string;
  tech: string[];
}

interface TiltState {
  rotX: number;
  rotY: number;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class Projects implements OnInit {

  projects: Project[] = [];
  spotlightPositions: { [id: number]: { x: number; y: number } } = {};
  tiltStates: { [id: number]: TiltState } = {};

  /* Estado táctil */
  private isTouching = false;

  constructor(private http: HttpClient, private router: Router) {}

  goToDetail(id: number) {
    this.router.navigate(['/projects', id]);
  }

  ngOnInit(): void {
    this.http.get<Project[]>('assets/data/projects.json').subscribe(data => {
      this.projects = data;
    });
  }

  /* ============================================================
      TOUCH START
  ============================================================ */
  onTouchStart() {
    this.isTouching = true;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
  }

  /* ============================================================
      TOUCH MOVE (TILT)
  ============================================================ */
  onTouchTilt(event: TouchEvent, id: number) {
    if (!this.isTouching) return;

    const touch = event.touches[0];
    this.handleTilt(touch.clientX, touch.clientY, id, event.currentTarget as HTMLElement);
  }

  /* ============================================================
      TOUCH END → soltar tarjeta
  ============================================================ */
  onTouchEnd(id: number) {
    this.isTouching = false;

    this.resetTilt(id);

    document.body.style.overflow = '';
    document.body.style.touchAction = '';

    // rebote suave
    this.tiltStates[id] = { rotX: 0, rotY: 0 };
    setTimeout(() => this.resetTilt(id), 120);
  }

  /* ============================================================
      MOUSE TILT
  ============================================================ */
  onTilt(event: MouseEvent, id: number) {
    this.handleTilt(event.clientX, event.clientY, id, event.currentTarget as HTMLElement);
  }

  /* ============================================================
     FUNCIÓN BASE PARA AMBOS
  ============================================================ */
  private handleTilt(clientX: number, clientY: number, id: number, card: HTMLElement) {

    const rect = card.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -10;
    const rotY = ((x - centerX) / centerX) * 10;

    this.tiltStates[id] = { rotX, rotY };
  }

  /* ============================================================
     RESET
  ============================================================ */
  resetTilt(id: number) {
    delete this.tiltStates[id];
  }

  /* ============================================================
     STYLE
  ============================================================ */
  getTiltStyle(id: number) {
    const tilt = this.tiltStates[id];
    if (!tilt) return { transform: 'rotateX(0deg) rotateY(0deg)' };

    return {
      transform: `rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg)`
    };
  }
}
