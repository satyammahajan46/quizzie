import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainHeaderComponent } from './main-header/main-header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FooterComponent } from './footer/footer.component';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [MainHeaderComponent, FooterComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
  ],
  exports: [MainHeaderComponent, FooterComponent],
})
export class HeaderModule { }
