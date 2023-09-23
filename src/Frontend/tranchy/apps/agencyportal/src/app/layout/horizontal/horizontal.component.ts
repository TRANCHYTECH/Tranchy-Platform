import { Component, OnInit } from '@angular/core';
import { TopbarComponent } from '../topbar/topbar.component';
import { HorizontalTopbarComponent } from '../horizontal-topbar/horizontal-topbar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'tranchy-app-horizontal',
  standalone: true,
  imports: [CommonModule, RouterModule, TopbarComponent, HorizontalTopbarComponent, FooterComponent],
  templateUrl: './horizontal.component.html',
  styleUrls: ['./horizontal.component.scss']
})

export class HorizontalComponent { }