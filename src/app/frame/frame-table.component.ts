import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Frame } from '@app/types';
import gql from 'graphql-tag';
import { all } from 'q';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '@app/core/alert.service';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'bm-frame-table',
  template: `
  <h4 *ngIf="loading">Loading...</h4>
  <div id="frameTableComponent">
    <div class="float-right">Display Count: {{ (this.smartTableSource ? this.smartTableSource.count() : 0) }}</div>
    <ng2-smart-table
    [settings]="settings"
    (edit)="onEdit($event)"
    [source]="smartTableSource"></ng2-smart-table>
  </div>
  `
})
export class FrameTableComponent implements OnInit {
  smartTableSource: LocalDataSource;
  allFrames: Frame[] = [];
  loading = true;
  

  settings = {
    mode: 'external',
    actions: {
        columnTitle: 'Edit',
        add: false,
        edit: true,
        delete: false,
    },
    pager: {
      perPage: 50
    },  
    columns: {
      dateReceived: {
        title: 'Received',
        width: '10%'
      },
      distributor: {
        title: 'Distributor',
        width: '10%'
      },
      brand: {
        title: 'Brand',
        width: '10%'
      },
      model: {
        title: 'Model',
        width: '10%'
      },
      colorCode: {
        title: 'Code',
        width: '5%'
      },
      colorName: {
        title: 'Color',
        width: '5%'
      },
      wholesalePrice: {
        title: 'WSP',
        width: '5%'
      },
      retailPrice: {
        title: 'RP',
        width: '5%'
      },
      minRetailPrice: {
        title: 'minReP',
        width: '5%'
      },
      purchased: {
        title: 'Sold',
        width: '5%'
      },
      dateSold: {
        title: 'Date Sold',
        width: '10%',
        sort: true,
      },
      soldForPrice: {
        title: 'Sold For'
      },
      img: {
        title: 'IMG',
        type: 'html',
      },
      notes: {
        title: 'Notes'
      },
    }
  };

  constructor(private apollo: Apollo, private router: Router, private alertService: AlertService) { }

  ngOnInit() {
    this.setupSubscriptions();

    
  
    // ------
    this.alertService.showAlert('warning', 'Loading from database.');
    this.apollo.watchQuery({
      query: gql`
        query AllFramesQuery {
            allFrames (orderBy: createdAt_DESC) {
                id
                distributor
                dateReceived
                brand
                model
                colorCode
                colorName
                wholesalePrice
                retailPrice
                minRetailPrice
                isCloseout
                isSun
                isPolarized
                isDrillmount
                notes
                purchase {
                    id
                    dateSold
                    price
                }
            }
        }
      `
    }).valueChanges.subscribe(res => {
      const allFrames = res.data['allFrames'];
      this.loading = res.data['loading'];
      const frames: Frame[] = [];

      if (allFrames) {
        this.alertService.showAlert('success', allFrames.length + ' frames loaded.');
      }

      allFrames.forEach(frame => {
        const f = this.getFrameTableRowFromDBResult(frame);

        frames.push(f);
      });

      this.allFrames = frames;
      this.smartTableSource = new LocalDataSource(this.allFrames);
    });
  }

  getFrameTableRowFromDBResult(frameDBRes) {
    const f = Object.assign({}, JSON.parse(JSON.stringify(frameDBRes)));
    f.dateReceived = new Date(f.dateReceived).toISOString().slice(0,10);

    f.purchased = (f.purchase ? 'Y' : 'N');
    f.dateSold = '';

    if (f.purchase && f.purchase.dateSold) {
        const dateSold = new Date(f.purchase.dateSold).toISOString().slice(0,10);
        f.dateSold = dateSold;
        f.soldForPrice = f.purchase.price;
    }
    // <a class="btn btn-primary" href="#" role="button">Link</a>
    f.img = '<a class="btn btn-primary btn-sm text-white noprint"' +
      ' target="_blank" href="https://www.google.com/search?tbm=isch&tbo=u&source=univ&q=' 
      + f.brand + ' ' + f.model + '"><i class="fa fa-google" aria-hidden="true"></i></a>'

    return f;
  }

  onEdit(event) {
    // send router link to edit frame (same window)
    // this.router.navigate(['/frame-edit'], { queryParams: { frameId: event.data.id } });
    // send router link to edit frame (new window)
    window.open('frame-edit?frameId=' + event.data.id);
  }

  setupSubscriptions() {
    let webSocket = new WebSocket('wss://subscriptions.graph.cool/v1/cjaasso0m081q0123g05giabw', 'graphql-subscriptions');
    webSocket.onopen = (event) => {
      const message = {
          type: 'init'
      }
    
      webSocket.send(JSON.stringify(message))
    }

    webSocket.onmessage = (event) => {
      const data = JSON.parse(event.data)
    
      switch (data.type) {
        case 'init_success': {
          console.log('init_success, the handshake is complete');

          const mutations = ['CREATED', 'UPDATED', 'DELETED'];

          for (var index = 0; index < mutations.length; index++) {
            var mutation = mutations[index];

            const message = {
              id: index + 1,
              type: 'subscription_start',
              query: `
                subscription newFrames {
                  Frame(filter: {
                    mutation_in: [${mutation}]
                  }) {
                    mutation
                    node {
                      id
                      distributor
                      dateReceived
                      brand
                      model
                      colorCode
                      colorName
                      wholesalePrice
                      retailPrice
                      minRetailPrice
                      isCloseout
                      isSun
                      isPolarized
                      isDrillmount
                      notes
                      purchase {
                          id
                          dateSold
                          price
                      }
                    }
                  }
                }
              `
            }
            webSocket.send(JSON.stringify(message))
            
          }
          break
        }
        case 'init_fail': {
          throw {
            message: 'init_fail returned from WebSocket server',
            data
          }
        }
        case 'subscription_data': {
          console.log('subscription data has been received', data.payload.data['Frame'])
          // data.payload['Frame']
          // data.payload['Frame'].mutation (eg: 'CREATED')
          // data.payload['Frame'].node.id

          const resFrame = data.payload.data['Frame'];

          if (resFrame) {
            switch (resFrame.mutation){
              case 'CREATED': {
                console.log(resFrame.mutation, resFrame.node.id);
                const node = resFrame.node;
                const newFrame = this.getFrameTableRowFromDBResult(node);
                this.allFrames.push(newFrame);
                // this.smartTableSource.add(newFrame);
                this.smartTableSource.refresh();
                break;
              }
              case 'UPDATED': {
                console.log(resFrame.mutation, resFrame.node.id);
                const node = resFrame.node;

                let frameNeedingUpdate = this.allFrames.find(x => x.id === node.id);

                if (frameNeedingUpdate) {
                  frameNeedingUpdate = Object.assign(frameNeedingUpdate, this.getFrameTableRowFromDBResult(node));
                  this.smartTableSource.refresh();
                }
                break;
              }
              case 'DELETED': {
                console.log(resFrame.mutation, resFrame); // node is null
                // const node = resFrame.node;
                
                // let frameNeedingUpdate = this.allFrames.find(x => x.id === node.id);

                // const index = this.allFrames.indexOf(frameNeedingUpdate);
                // console.log(index);
                // this.allFrames.splice(index, 1);
                // this.smartTableSource.refresh();
                
                break;
              }
            }
          }
          break
        }
        case 'subscription_success': {
          console.log('subscription_success')
          break
        }
        case 'subscription_fail': {
          throw {
            message: 'subscription_fail returned from WebSocket server',
            data
          }
        }
      }
    }
  }
}
