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
    const a = await this.httpClient.get('http://localhost:7200/question/3434', { withCredentials: true }).toPromise();
    console.log(a);
  }
}
