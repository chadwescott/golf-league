import { Component } from '@angular/core';
import { Paths } from './app-routing.module';

@Component({
  selector: 'glm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  paths = Paths;
  title = 'golf-league';
}
