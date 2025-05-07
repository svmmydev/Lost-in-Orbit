import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { GameComponent } from "../game/game.component";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, GameComponent],
})
export class HomePage {}
