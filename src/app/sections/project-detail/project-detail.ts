import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
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
  description: string;
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

  private ctx!: CanvasRenderingContext2D;
  private particles: any[] = [];
  private numParticles = 80;

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

  /* ======================= */
  /*    GALERÍA MANUAL       */
  /* ======================= */

  selectImage(index: number) {
    this.currentIndex = index;
    this.selectedImage = this.project!.gallery[index].full;
  }

  nextImage() {
    if (!this.project) return;
    this.currentIndex = (this.currentIndex + 1) % this.project.gallery.length;
    this.selectedImage = this.project.gallery[this.currentIndex].full;
  }

  prevImage() {
    if (!this.project) return;
    this.currentIndex =
      (this.currentIndex - 1 + this.project.gallery.length) %
      this.project.gallery.length;
    this.selectedImage = this.project.gallery[this.currentIndex].full;
  }

  /* ======================= */
  /*        VOLVER           */
  /* ======================= */

  volverAProjects() {
    this.router.navigate(['/']).then(() => {
      setTimeout(() => {
        const el = document.getElementById('projects');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
    });
  }

  /* ======================= */
  /*     CANVAS BACKGROUND   */
  /* ======================= */

  ngAfterViewInit(): void {
    this.startCanvas();
  }

  private startCanvas() {
    const canvas = this.el.nativeElement.querySelector('#projectCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    this.ctx = ctx;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.particles = Array.from({ length: this.numParticles }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6
    }));

    const animate = () => {
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

      requestAnimationFrame(animate);
    };

    animate();
  }
}
