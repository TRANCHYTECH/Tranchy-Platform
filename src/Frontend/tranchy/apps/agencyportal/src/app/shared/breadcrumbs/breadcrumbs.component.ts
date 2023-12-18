import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type BreadcrumbItem = {
  active?: boolean;
  label?: string;
};

@Component({
  selector: 'tranchy-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  standalone: true,
  imports: [CommonModule]
})

/**
 * Bread Crumbs Component
 */
export class BreadcrumbsComponent {

  @Input() title: string | undefined;
  @Input()
  breadcrumbItems!: Array<BreadcrumbItem>
}
