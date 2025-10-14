import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Project{
  id: number;
  title: string;
  description: string;
  image: string;
  github: string;
  demo: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class Projects  implements OnInit{
  projects: Project[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Project[]>('assets/data/projects.json').subscribe(data => {
      this.projects = data;
    });
  }
}