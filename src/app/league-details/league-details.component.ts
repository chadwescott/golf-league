import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LeagueYear } from '../models/league-year.model';
import { LeagueService } from '../services/league.service';

@UntilDestroy()
@Component({
  selector: 'glm-league-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule,
    ReactiveFormsModule,
    RouterLink],
  templateUrl: './league-details.component.html',
  styleUrl: './league-details.component.scss',
})
export class LeagueDetailsComponent {
  formGroup!: FormGroup;
  displayedColumns: string[] = ['year'];
  dataSource: LeagueYear[] = [];
  leagueId: string = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly leagueService: LeagueService) {
    this.leagueService.leagueYears$
      .pipe(untilDestroyed(this))
      .subscribe(years => this.dataSource = years);
  }

  ngOnInit() {
    this.leagueId = this.route.snapshot.params['id'];
    this.leagueService.getLeagueYears(this.leagueId)
      .pipe(untilDestroyed(this))
      .subscribe();

    this.initializeForm();
  }

  initializeForm() {
    const params: any = {
      year: new FormControl(new Date().getFullYear(), Validators.required)
    };

    this.formGroup = new FormGroup(params);
  }

  addLeagueYear() {
    const leagueYear = this.formGroup.value as LeagueYear;
    leagueYear.leagueId = this.leagueId;
    this.leagueService.addLeagueYear(leagueYear);
  }
}
