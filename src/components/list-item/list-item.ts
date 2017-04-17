import { Component, Input, Output, EventEmitter} from '@angular/core';

/*
  Generated class for the ListItem component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'list-item',
  templateUrl: 'list-item.html'
})
export class ListItemComponent {

  @Input() type: string;
  @Input() orderId: number;
  @Output() itemClick = new EventEmitter();

  constructor() {
  }

  /**
   * Component Methods
   */

  onItemClick(){
    this.itemClick.emit({orderId: this.orderId});
  }
}
