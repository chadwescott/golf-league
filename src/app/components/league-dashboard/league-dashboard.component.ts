import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { map } from 'rxjs/operators';
import { Paths } from '../../app.routes';
import { League } from '../../models/league.model';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-league-dashboard',
  imports: [RouterOutlet],
  templateUrl: './league-dashboard.component.html',
  styleUrl: './league-dashboard.component.scss',
})
export class LeagueDashboardComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly appStateService = inject(AppStateService);

  ngOnInit(): void {
    this.route.data.pipe(
      takeUntilDestroyed(this.destroyRef),
      map(data => (data['league'] as League | null) ?? null)
    ).subscribe(league => {
      if (league) {
        this.appStateService.selectedLeague.set(league);
        return;
      }

      this.appStateService.selectedLeague.set(null);
      this.router.navigate(['/', Paths.leagues]);
    });
  }
}
