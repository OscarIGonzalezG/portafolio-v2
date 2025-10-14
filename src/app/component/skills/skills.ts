import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface SkillItem {
  name: string;
  icon: string;
}

interface SkillCategory {
  category: string;
  items: SkillItem[];
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './skills.html',
  styleUrl: './skills.css'
})
export class Skills implements OnInit{
  skills: SkillCategory[] = [];
  spotlightPositions: { [key: string]: { x: number, y: number } } = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<SkillCategory[]>('assets/data/skills.json')
      .subscribe(data => this.skills = data);
  }

  updateSpotlight(event: MouseEvent, skillName: string) {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.spotlightPositions[skillName] = { x, y };
  }

  resetSpotlight(skillName: string) {
    delete this.spotlightPositions[skillName];
  }
}