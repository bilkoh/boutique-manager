import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Boutique Manager';
  fluidContainerRoutes = [
    'frames',   // routes in which to change container class
    'patients', // from fixed sized to fluid size
  ];
  containerIsFluid = false;

  constructor (private route: ActivatedRoute, private router: Router) {
    
    router.events
      .filter(e => e instanceof NavigationEnd)
      .forEach(e => {
        const snapshotUrl = route.root.firstChild.snapshot.url;
        if (snapshotUrl.length > 0) {
          const path = snapshotUrl[0].path;

          let matched = false;
          this.fluidContainerRoutes.forEach(r => {
              if (r === path) {
                matched = true;
        
              }
          });

          this.containerIsFluid = matched;
        }
    });
  }
}
