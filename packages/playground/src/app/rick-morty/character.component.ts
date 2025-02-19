import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SubscribeModule } from '@ngneat/subscribe';
import { map, switchMap } from 'rxjs';
import { RickAndMortyService } from '../rick-and-morty.service';
import { CharacterEpisodeComponent } from './character-episode.component';
import { LocationComponent } from './location.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SubscribeModule,
    RouterModule,
    CharacterEpisodeComponent,
    LocationComponent,
  ],
  template: `
    <ng-container *subscribe="character$ as character">
      <p *ngIf="character.status === 'loading'">Loading...</p>
      <p *ngIf="character.status === 'error'">Error :(</p>
      <ng-container *ngIf="character.status === 'success'">
        <h2>{{ character.data.name }}</h2>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Gender</td>
              <td>{{ character.data.gender }}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td>{{ character.data.status }}</td>
            </tr>
            <tr>
              <td>Species</td>
              <td>{{ character.data.species }}</td>
            </tr>
            <tr>
              <td>Origin</td>
              <td>{{ character.data.origin.name }}</td>
            </tr>
            <tr>
              <td>Location</td>
              <td>
                <location
                  [locationUrl]="character.data.location.url"
                ></location>
              </td>
            </tr>
          </tbody>
        </table>
        <h4>Characters</h4>
        <character-episode
          *ngFor="let episode of character.data.episode"
          [episode]="episode"
        ></character-episode>
      </ng-container>
    </ng-container>
  `,
})
export class CharacterComponent {
  route = inject(ActivatedRoute);
  apiService = inject(RickAndMortyService);
  characterId$ = this.route.params.pipe(map((params) => params['characterId']));
  character$ = this.characterId$.pipe(
    switchMap(
      (characterId) => this.apiService.getCharacter(characterId).result$
    )
  );
}
