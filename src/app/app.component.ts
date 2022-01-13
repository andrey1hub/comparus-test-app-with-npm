import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { EngineService } from './engine.service';
import { ScoreData } from './interfaces/score-data.system';
import { NotifyDialogComponent } from './mat/notify-dialog/notify-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  timeControl!: FormControl
  playing: boolean = false
  score!: ScoreData

  constructor(public dialog: MatDialog, private engineService: EngineService) { }

  ngOnInit(): void {
    this.engineService.score.subscribe(newScore => this.processScoreChange(newScore))
    this.timeControl = new FormControl(1000, [Validators.required, Validators.min(1), Validators.pattern(/^[1-9][0-9]*$/)])

    window.setTimeout(() => this.engineService.init(), 0)
  }

  onStart(): void {
    this.engineService.start(this.timeControl.value, () => {
      this.playing = true
      this.timeControl.disable()
    })
  }
  onStop(): void {
    this.playing = false
    this.timeControl.enable()
    this.engineService.init()
  }
  processScoreChange(newScore: ScoreData): void {
    this.score = newScore

    if (this.score.playing === false) {
      const dialogRef = this.dialog.open(NotifyDialogComponent, {
        width: '50%',
        minWidth: '250px',
        data: {
          userScore: this.score.user,
          compScore: this.score.comp
        }
      })

      dialogRef.afterClosed().subscribe(() => this.onStop())
    }
  }
}
