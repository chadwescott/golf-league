import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

    const value = this.formGroup.value;
    const player: Player = {
      id: '', // Firestore will assign id
      firstName: value.firstName,
      lastName: value.lastName,
      imagePath: value.imagePath ?? '',
      handicap: value.handicap === null || value.handicap === '' ? null : Number(value.handicap)
    };

    this.playerService.addPlayer(player);
    this.formGroup.reset({ handicap: null });
  }
}
