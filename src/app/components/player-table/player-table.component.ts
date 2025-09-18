import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Player } from '../../models/player.model';

@UntilDestroy()
@Component({
  selector: 'glm-player-table',
  standalone: true,
  templateUrl: './player-table.component.html',
  styleUrls: ['./player-table.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule,
    ReactiveFormsModule
  ]
})
export class PlayerTableComponent {
  @Output()
  deletePlayer = new EventEmitter<Player>();

  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'handicap', 'delete'];
  players = input<Player[]>();

  constructor() {
  }
}
