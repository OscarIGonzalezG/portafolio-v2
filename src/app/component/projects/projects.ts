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

  constructor(private http: HttpClient, private router: Router) {}

  goToDetail(id: number) {
  this.router.navigate(['/projects', id]);
}

  ngOnInit(): void {
    this.http.get<Project[]>('assets/data/projects.json').subscribe(data => {
      this.projects = data;
    });
  }

  onTilt(event: MouseEvent, id: number) {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    this.tiltStates[id] = { rotX: rotateX, rotY: rotateY };
    this.spotlightPositions[id] = { x, y };
  }

  resetTilt(id: number) {
    delete this.tiltStates[id];
  }

  resetSpotlight(id: number) {
    delete this.spotlightPositions[id];
  }

  getTiltStyle(id: number) {
    const tilt = this.tiltStates[id];
    if (!tilt) return { transform: 'rotateX(0deg) rotateY(0deg)' };

    return {
      transform: `rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg)`
    };
  }
}
