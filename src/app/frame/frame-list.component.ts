import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Frame } from '@app/types';

import { ALL_FRAMES_QUERY, AllFramesQueryResponse } from '@app/graphql';

@Component({
  selector: 'bm-frame-list',
  template: `
  <h4 *ngIf="loading">Loading...</h4>
  <div id="frameListComponent">
    <div *ngFor="let frame of allFrames">
      <bm-frame-item [frame]="frame"></bm-frame-item>
    </div>
  </div>
  `
})
export class FrameListComponent implements OnInit {
  allFrames: Frame[] = [];
  loading = true;

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.apollo.watchQuery({
      query: ALL_FRAMES_QUERY
    }).valueChanges.subscribe(res => {
      // this.allFrames = res.data.allFrames;
      this.allFrames = res.data['allFrames'];
      this.loading = res.data['loading'];
      console.log('frames', res.data['allFrames']);
    });
  }

}
