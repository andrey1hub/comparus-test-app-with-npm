import { Injectable } from '@angular/core';
import { Observable, Subject, Subscriber } from 'rxjs';

import { TileData } from 'src/app/interfaces/tile-data.system';
import { ScoreData } from 'src/app/interfaces/score-data.system';

@Injectable({
  providedIn: 'root'
})
export class EngineService {
  private stack: TileData[] = []
  private playing: boolean = false
  private activeTile: TileData | null = null
  private currScore!: ScoreData
  private scoreSub!: Subscriber<ScoreData>
  private tilesSub!: Subscriber<TileData[]>

  private runRound(time: number): void {
    if (this.playing) {
      if (this.activeTile) this.publishTileStatus(this.activeTile, EngineService.TILE_STATUSES.FAILED)

      this.computeAndCheckAndPublishScore()

      if (this.playing) {
        this.publishTileStatus(this.selectRandomAvailableTile(), EngineService.TILE_STATUSES.LIGHTED)
        window.setTimeout(() => this.runRound(time), time)
      }
    }
  }
  private selectRandomAvailableTile(): TileData {
    let availableTiles: TileData[] = this.stack.filter(item => item.status === EngineService.TILE_STATUSES.INITIAL)
    return availableTiles[Math.floor(Math.random() * availableTiles.length)]
  }
  private publishTileStatus(tile: TileData, status: string) {
    tile.status = status
    this.tileStatus.next(JSON.parse(JSON.stringify(tile)))

    if (status === EngineService.TILE_STATUSES.LIGHTED) {
      this.activeTile = tile
    } else {
      this.activeTile = null
    }
  }
  private computeAndCheckAndPublishScore(initScore?: ScoreData): void {
    if (initScore) {
      this.currScore = initScore
    } else {
      this.currScore.user = this.stack.filter(item => item.status === EngineService.TILE_STATUSES.RESOLVED).length
      this.currScore.comp = this.stack.filter(item => item.status === EngineService.TILE_STATUSES.FAILED).length

      if (this.currScore.user === 0 && this.currScore.comp === 0) {
        this.currScore.playing = null
      } else if (this.currScore.user < 10 && this.currScore.comp < 10) {
        this.currScore.playing = true
      } else {
        this.currScore.playing = false
        this.playing = false
      }
    }

    this.scoreSub.next(JSON.parse(JSON.stringify(this.currScore)))
  }
  private static getScoreInitData(): ScoreData {
    return { user: 0, comp: 0, playing: null }
  }
  private static getTilesInitData(): TileData[] {
    let stack: TileData[] = []

    for (let i = 1; i <= 100; i++) {
      stack.push({ id: i, status: EngineService.TILE_STATUSES.INITIAL })
    }
    return stack
  }

  public score: Observable<ScoreData> = new Observable(subscriber => {
    this.scoreSub = subscriber
  })
  public tiles: Observable<TileData[]> = new Observable(subscriber => {
    this.tilesSub = subscriber
  })
  public tileStatus: Subject<TileData> = new Subject()
  public static TILE_STATUSES = {
    INITIAL: 'initial',
    LIGHTED: 'lighted',
    RESOLVED: 'resolved',
    FAILED: 'failed'
  }

  constructor() { }

  init(): void {
    this.stack = EngineService.getTilesInitData()
    this.tilesSub.next(JSON.parse(JSON.stringify(this.stack)))
    this.computeAndCheckAndPublishScore(EngineService.getScoreInitData())
  }
  start(time: number, handler: Function): void {
    if (!this.playing) {
      handler()
      this.playing = true
      this.runRound(time)
    }
  }
  tileClicked(tile: TileData): void {
    if (this.activeTile?.id === tile.id) {
      this.publishTileStatus(this.activeTile, EngineService.TILE_STATUSES.RESOLVED)
      this.computeAndCheckAndPublishScore()
    }
  }
}
