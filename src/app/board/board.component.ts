import { Component, OnInit } from '@angular/core';

import { TileData } from 'src/app/interfaces/tile-data.system';
import { EngineService } from 'src/app/engine.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  stack: TileData[] = []

  constructor(private engineService: EngineService) { }

  ngOnInit(): void {
    this.engineService.tiles.subscribe(tiles => this.processTilesReset(tiles))
  }

  processTilesReset(tiles: TileData[]): void {
    this.stack = tiles
  }
}
