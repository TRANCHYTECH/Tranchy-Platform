import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'tranchy-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {

  httpClient = inject(HttpClient);

  async ngOnInit(): Promise<void> {
    const a = await this.httpClient.get('[ASK]/question/3434').toPromise();
    console.log(a);
  }
}
