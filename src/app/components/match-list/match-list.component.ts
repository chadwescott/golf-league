import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Paths } from '../../app.routes';
import { Match } from '../../models/match.model';

@Component({
  selector: 'app-match-list',
  imports: [DatePipe, RouterLink],
  templateUrl: './match-list.component.html',
  styleUrl: './match-list.component.scss',
})
export class MatchListComponent {
  matches = input.required<Match[]>();

  paths = Paths;
}
