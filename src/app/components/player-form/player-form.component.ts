import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  @Output() playerAdded = new EventEmitter<Player>();
  formGroup!: FormGroup;

  constructor(private readonly playerService: PlayerService) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.formGroup = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      imagePath: new FormControl('')
    });
  }

  addPlayer(): void {
    if (this.formGroup.invalid) { return; }

    const player = this.formGroup.value as Player;

    this.playerService.addPlayer(player).then((created) => this.playerAdded.emit(created));
  }
}
