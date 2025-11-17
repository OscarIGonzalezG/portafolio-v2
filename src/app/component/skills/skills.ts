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


@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.html',
  styleUrl: './skills.css'
})

export class Skills implements OnInit {

  skills: SkillCategory[] = [];
  filteredSkills: SkillItem[] = [];
  activeCategory: string = 'Todo';

  flipped: { [key: string]: boolean } = {};

  // NUEVO SISTEMA DE ANIMACIONES
  tiltStyles: { [key: string]: any } = {};
  spotlightStyles: { [key: string]: any } = {};

  /** Iconos que necesitan modo blanco */
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

  // 🔥 NUEVA ANIMACIÓN DE TILT + SPOTLIGHT
  onTilt(event: MouseEvent, name: string) {
    const card = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX - card.left;
    const y = event.clientY - card.top;

    const rotX = ((y - card.height / 2) / 12);
    const rotY = ((card.width / 2 - x) / 12);

    this.tiltStyles[name] = {
      transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`
    };

    this.spotlightStyles[name] = {
      background: `radial-gradient(circle 90px at ${x}px ${y}px,
        rgba(61,139,255,0.28),
        transparent 70%)`
    };
  }

  resetTilt(name: string) {
    this.tiltStyles[name] = { transform: 'rotateX(0deg) rotateY(0deg)' };
    this.spotlightStyles[name] = {};
  }
}
