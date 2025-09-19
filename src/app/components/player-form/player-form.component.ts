import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Player } from '../../models/player.model';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'glm-player-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
  ],
  templateUrl: './player-form.component.html',
  styleUrl: './player-form.component.scss'
})
export class PlayerFormComponent {
  @Input() player: Player | null = null;

  @Output() playerAdded = new EventEmitter<Player>();
  @Output() playerUpdated = new EventEmitter<Player>();

  form!: FormGroup;

  constructor(
    private readonly playerService: PlayerService,
    private readonly fb: FormBuilder
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      imagePath: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['player'] && this.player) {
      this.form.patchValue({
        firstName: this.player.firstName,
        lastName: this.player.lastName,
        imagePath: this.player.imagePath
      });
    }
  }

  savePlayer(): void {
    if (this.form.invalid) { return; }
    const playerData = { ...this.player, ...this.form.value } as Player;
    playerData.id = this.player?.id ?? '';

    if (playerData.id) {
      this.playerService.updatePlayer(playerData).then((updated) => {
        this.playerUpdated.emit(updated);
        this.player = null;
        this.form.reset();
      });
    } else {
      this.playerService.addPlayer(playerData).then((created) => {
        this.playerAdded.emit(created);
        this.player = null;
        this.form.reset();
      });
    }
  }
}
