import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Paths } from '../../app-routing.module';
import { League } from '../../models/league.model';
import { LeagueService } from '../../services/league.service';

@UntilDestroy()
@Component({
  selector: 'glm-league-select',
  standalone: true,
  templateUrl: './league-select.component.html',
  styleUrls: ['./league-select.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule,
    ReactiveFormsModule,
    RouterLink
  ]
})
export class LeagueSelectComponent {
  paths = Paths
  formGroup!: FormGroup;
  displayedColumns: string[] = ['name'];
  dataSource: League[] = [];

  constructor(private leagueService: LeagueService) {
    effect(() => {
      this.dataSource = this.leagueService.leagues();
    })

    this.leagueService.getLeagues()
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    const params: any = {
      name: new FormControl('', Validators.required)
    };

    this.formGroup = new FormGroup(params);
  }

  addLeague() {
    const league = this.formGroup.value as League;
    this.leagueService.addLeague(league);
  }
}
