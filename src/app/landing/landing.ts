import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../component/navbar/navbar';
import { Hero } from '../component/hero/hero';
import { About } from '../component/about/about';
import { Experience } from '../component/experience/experience';
import { Skills } from '../component/skills/skills';
import { Projects } from '../component/projects/projects';
import { Contact } from '../component/contact/contact';
import { Footer } from '../component/footer/footer';
 
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, Navbar, Hero, About, Experience, Skills, Projects, Contact, Footer],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {

}
