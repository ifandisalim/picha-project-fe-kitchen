import {Component, Input} from '@angular/core';
import {Feedback} from "../../beans/Feedback";


/*
 Generated class for the FeedbackMultiple component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
@Component({
    selector: 'feedback-multiple',
    templateUrl: 'feedback-multiple.html'
})
export class FeedbackMultipleComponent{

    @Input() feedbackTitle: string;
    @Input() feedbackcollection: Feedback[];

    constructor() {
    }

}
