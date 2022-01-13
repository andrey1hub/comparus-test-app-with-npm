import { Component, Input, OnInit } from '@angular/core';

import { TileData } from 'src/app/interfaces/tile-data.system';
import { EngineService } from 'src/app/engine.service';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit {
  @Input() data!: TileData

  constructor(private engineService: EngineService) { }

  ngOnInit(): void {
    this.engineService.tileStatus.subscribe(tileStatus => this.processStatusChange(tileStatus))
  }

  onTileClick(): void {
    if (this.data.status === EngineService.TILE_STATUSES.LIGHTED) this.engineService.tileClicked(this.data)
  }
  processStatusChange(tileStatus: TileData): void {
    if (
      this.data.id === tileStatus.id &&
      this.data.status !== EngineService.TILE_STATUSES.RESOLVED &&
      this.data.status !== EngineService.TILE_STATUSES.FAILED
    ) {
      this.data.status = tileStatus.status
    }
  }
}
