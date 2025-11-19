import { Component, OnInit, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';


interface ProjectImage {
  full: string;
  thumb: string;
}

interface Project {
  id: number;
  title: string;
  shortDescription: string;
  longDescription: string;
  image: string;
  github: string;
  demo: string;
  tech: string[];
  gallery: ProjectImage[];
}

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.css'
})
export class ProjectDetail implements OnInit, AfterViewInit {

  project?: Project;
  selectedImage = '';
  currentIndex = 0;

  isFading = false; // 👈 fade al cambiar imagen

  // Canvas
  private ctx!: CanvasRenderingContext2D;
  private particles: { x: number; y: number; vx: number; vy: number }[] = [];
  private readonly numParticles = 100;
  private readonly maxDistance = 130;
  private mouse = { x: 0, y: 0 };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.http.get<Project[]>('assets/data/projects.json').subscribe(data => {
      this.project = data.find(p => p.id === id);

      if (this.project?.gallery?.length) {
        this.selectedImage = this.project.gallery[0].full;
      }
    });
  }

  // Animación fade
  private animateImageChange(index: number) {
    this.isFading = true;

    setTimeout(() => {
      this.currentIndex = index;
      this.selectedImage = this.project!.gallery[index].full;

      setTimeout(() => {
        this.isFading = false;
      }, 250);
    }, 150);
  }

  selectImage(i: number) {
    this.animateImageChange(i);
  }

  nextImage() {
    if (!this.project) return;
    const next = (this.currentIndex + 1) % this.project.gallery.length;
    this.animateImageChange(next);
  }

  prevImage() {
    if (!this.project) return;
    const prev = (this.currentIndex - 1 + this.project.gallery.length) %
      this.project.gallery.length;
    this.animateImageChange(prev);
  }

  volverAProjects() {
    this.router.navigate(['/']).then(() => {
      setTimeout(() => {
        const el = document.getElementById('projects');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    });
  }

  // ==================  CANVAS  ==================

  ngAfterViewInit(): void {
    this.startCanvas();

        setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }, 0);
  }
  

  private startCanvas() {
    const canvas = this.el.nativeElement.querySelector('#detailCanvas') as HTMLCanvasElement;
    this.ctx = canvas.getContext('2d')!;

    this.resizeCanvas(canvas);
    this.initParticles(canvas);

    requestAnimationFrame(() => this.animate(canvas));
  }

  private resizeCanvas(canvas: HTMLCanvasElement) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  @HostListener('window:resize')
  onResize() {
    const canvas = this.el.nativeElement.querySelector('#detailCanvas') as HTMLCanvasElement;
    this.resizeCanvas(canvas);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
  }

  private initParticles(canvas: HTMLCanvasElement) {
    this.particles = Array.from({ length: this.numParticles }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8
    }));
  }

  private animate(canvas: HTMLCanvasElement) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(61,139,255,0.8)';
      ctx.fill();
    }

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.maxDistance) {
          const opacity = 1 - dist / this.maxDistance;
          ctx.strokeStyle = `rgba(255,139,62,${opacity * 0.3})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(this.particles[i].x, this.particles[i].y);
          ctx.lineTo(this.particles[j].x, this.particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.animate(canvas));
  }
}
