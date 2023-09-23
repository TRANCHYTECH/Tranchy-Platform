import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule],
  exports: [CommonModule, RouterModule, TranslateModule, ButtonModule]
})
export class SharedModule { }
