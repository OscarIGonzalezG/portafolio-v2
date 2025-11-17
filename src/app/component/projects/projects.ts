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
  tiltStates: { [id: number]: TiltState } = {};

  /* Estado táctil */
  private touchStartY = 0;
  private touchStartX = 0;
  private isTiltAllowed = false;

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
        TOUCH START: guardar coordenadas
  ============================================================ */
  onTouchStart(event: TouchEvent) {
    const touch = event.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.isTiltAllowed = false;
  }

  /* ============================================================
       TOUCH MOVE: decidir si scroll o tilt
  ============================================================ */
  onTouchTilt(event: TouchEvent, id: number) {
    const touch = event.touches[0];
    const dx = Math.abs(touch.clientX - this.touchStartX);
    const dy = Math.abs(touch.clientY - this.touchStartY);

    // 🔥 Si se movió más en vertical que horizontal ⇒ permitir scroll
    if (dy > dx) {
      this.isTiltAllowed = false;
      return; // permitir scroll natural
    }

    // 🔥 Si se movió más horizontal ⇒ tilt 3D
    this.isTiltAllowed = true;

    const card = event.currentTarget as HTMLElement;
    this.handleTilt(touch.clientX, touch.clientY, id, card);
  }

  /* ============================================================
       TOUCH END: pequeño rebote
  ============================================================ */
  onTouchEnd(id: number) {
    this.tiltStates[id] = { rotX: 0, rotY: 0 };
    setTimeout(() => this.resetTilt(id), 120);
  }

  /* ============================================================
       DESKTOP TILT
  ============================================================ */
  onTilt(event: MouseEvent, id: number) {
    this.handleTilt(event.clientX, event.clientY, id, event.currentTarget as HTMLElement);
  }

  /* ============================================================
       FUNCIÓN BASE
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
