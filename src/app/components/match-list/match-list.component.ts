import { DatePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Paths } from '../../app.routes';
import { Match } from '../../models/match.model';

@Component({
  selector: 'app-match-list',
  imports: [DatePipe, MatFormFieldModule, MatSelectModule],
  templateUrl: './match-list.component.html',
  styleUrl: './match-list.component.scss',
})
export class MatchListComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  matches = input.required<Match[]>();

  paths = Paths;

  get selectedMatchId(): string | null {
    return this.route.firstChild?.snapshot.paramMap.get('matchId') ?? null;
  }

  onMatchChange(matchId: string): void {
    if (!matchId || matchId === this.selectedMatchId) {
      return;
    }

    this.router.navigate([this.paths.matches, matchId], { relativeTo: this.route });
  }
}
