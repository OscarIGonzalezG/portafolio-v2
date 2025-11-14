import { Component, AfterViewInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrls: ['./hero.css']
})
export class Hero implements AfterViewInit{
  private ctx!: CanvasRenderingContext2D;
  private particles: { x: number; y: number; vx: number; vy: number }[] = [];
  private mouse = { x: 0, y: 0 };
  private readonly numParticles = 100;
  private readonly maxDistance = 130;

  // ⚙️ Velocidad de escritura (ms por carácter)
  private typingSpeed = 38;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    // Título con typewriter, párrafo ya está visible
    setTimeout(() => {
      this.typeOnce('Hola, soy Oscar González');
    }, 50);

    // Canvas
    const canvas = this.el.nativeElement.querySelector('#networkCanvas') as HTMLCanvasElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas(canvas);
    this.initParticles(canvas);
    requestAnimationFrame(() => this.animate(canvas));
  }

  // ✍️ Typewriter una sola vez (solo en el título)
  private typeOnce(text: string) {
    const element = this.el.nativeElement.querySelector('.typewriter') as HTMLElement;

    const cursor = document.createElement('span');
    cursor.classList.add('cursor');
    cursor.textContent = '|';
    element.after(cursor);

    let i = 0;
    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, this.typingSpeed);
      } else {
        cursor.classList.add('blink');
        // pequeño fade-out del cursor
        setTimeout(() => { cursor.style.opacity = '0'; }, 700);
      }
    };
    type();
  }

  private resizeCanvas(canvas: HTMLCanvasElement) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  @HostListener('window:resize')
  onResize() {
    const canvas = this.el.nativeElement.querySelector('#networkCanvas') as HTMLCanvasElement;
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
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of this.particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      // Nodos
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(61,139,255,0.8)';
      this.ctx.fill();
    }

    // Conexiones
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < this.maxDistance) {
          const opacity = 1 - dist / this.maxDistance;
          this.ctx.strokeStyle = `rgba(255,139,62,${opacity * 0.3})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }

    // Reacción al mouse
    for (const p of this.particles) {
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 120) {
        p.vx += dx / dist * 0.01;
        p.vy += dy / dist * 0.01;
      }
    }

    requestAnimationFrame(() => this.animate(canvas));
  }
}
