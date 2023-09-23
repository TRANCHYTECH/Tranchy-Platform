import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';

@NgModule({
  imports: [CommonModule],
  exports: [CommonModule, TranslateModule, ButtonModule]
})
export class SharedModule { }
