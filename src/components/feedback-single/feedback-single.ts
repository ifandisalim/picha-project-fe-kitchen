import { Component, Input, Output, EventEmitter } from '@angular/core';

/*
 Generated class for the FeedbackSingle component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
@Component({
    selector: 'feedback-single',
    templateUrl: 'feedback-single.html'
})
export class FeedbackSingleComponent {

    @Input() feedbackTitle: string;
    @Input() feedback;
    @Output() itemClicked = new EventEmitter();


    constructor() {
    }

    onItemClicked(){
        this.itemClicked.emit({orderId: this.feedback.orderId});
    }


}
