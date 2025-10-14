import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Experien {
  role: string;
  company: string;
  period: string;
  description: string;
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './experience.html',
  styleUrl: './experience.css'
})
export class Experience implements OnInit{
  experiences: Experien[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Experien[]>('assets/data/experience.json')
      .subscribe(data => this.experiences = data);
  }

}
