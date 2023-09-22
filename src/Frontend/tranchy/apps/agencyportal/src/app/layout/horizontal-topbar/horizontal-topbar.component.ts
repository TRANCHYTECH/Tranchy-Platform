import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

// Menu Pachage
// import MetisMenu from 'metismenujs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'tranchy-app-horizontal-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './horizontal-topbar.component.html',
  styleUrls: ['./horizontal-topbar.component.scss']
})
export class HorizontalTopbarComponent {
}
