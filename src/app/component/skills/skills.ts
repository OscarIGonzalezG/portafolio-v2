import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import skillsData from '../../../assets/data/skills.json';

interface SkillItem {
  name: string;
  icon: string;
  description: string;
}

interface SkillCategory {
  category: string;
  icon: string;
  items: SkillItem[];
}

interface TiltState {
  rotX: number;
  rotY: number;
}


@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.html',
  styleUrl: './skills.css'
})

export class Skills implements OnInit{

skills: SkillCategory[] = [];
  filteredSkills: SkillItem[] = [];
  activeCategory: string = 'Todo';

  spotlightPositions: { [key: string]: { x: number; y: number } } = {};
  tiltStates: { [key: string]: TiltState } = {};
  flipped: { [key: string]: boolean } = {};

  /** Iconos con fondo oscuro → convertir a blanco */
  darkIcons = [
    'GitHub',
    'Git',
    'Postman',
    'Docker',
    'IntelliJ IDEA',
    'NPM'
  ];

  ngOnInit(): void {
    this.skills = skillsData as SkillCategory[];
    this.applyFilter('Todo');
  }

  isDarkIcon(name: string): boolean {
    return this.darkIcons.includes(name);
  }

  applyFilter(category: string) {
    this.activeCategory = category;

    if (category === 'Todo') {
      this.filteredSkills = this.skills.flatMap(s => s.items);
    } else {
      const found = this.skills.find(s => s.category === category);
      this.filteredSkills = found ? found.items : [];
    }
  }

  toggleFlip(skillName: string) {
    this.flipped[skillName] = !this.flipped[skillName];
  }

  isFlipped(skillName: string): boolean {
    return !!this.flipped[skillName];
  }

  onTilt(event: MouseEvent, skillName: string) {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    this.tiltStates[skillName] = { rotX: rotateX, rotY: rotateY };
    this.spotlightPositions[skillName] = { x, y };
  }

  resetTilt(skillName: string) {
    delete this.tiltStates[skillName];
  }

  resetSpotlight(skillName: string) {
    delete this.spotlightPositions[skillName];
  }

  getTiltStyle(skillName: string) {
    const tilt = this.tiltStates[skillName];

    if (!tilt) {
      return {
        transform: 'rotateX(0deg) rotateY(0deg)'
      };
    }

    return {
      transform: `rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg)`
    };
  }
}
