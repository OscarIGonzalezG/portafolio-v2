import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  github: string;
  demo: string;
}

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.css'
})
export class ProjectDetail implements OnInit {
  project?: Project;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private scroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.http.get<Project[]>('assets/data/projects.json').subscribe(data => {
      this.project = data.find(p => p.id === id);
    });
  }

volverAProjects() {
  this.router.navigate(['/']).then(() => {
    setTimeout(() => {
      const el = document.getElementById('projects');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  });
}
}