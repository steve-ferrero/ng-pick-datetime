/**
 * dialog.component
 */

import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import * as moment from 'moment/moment';
import { Moment } from 'moment/moment';
import { PickerService } from './picker.service';
import { Subscription } from 'rxjs/Rx';
import { TRANSLATION_PROVIDERS } from './translations';
import { TranslateService } from './translate.service';

@Component({
    selector: 'date-time-dialog',
    template: `<div class="picker-overlay" [ngClass]="{'picker-overlay-dropdown': mode === 'dropdown'}" *ngIf="(mode === 'popup' || mode === 'dropdown') && show" (click)="cancelDialog()"></div><div *ngIf="(show && (mode === 'dropdown' || mode === 'popup')) || mode === 'inline'" [ngClass]="{
        'picker-popup': mode === 'popup',
        'picker-dropdown': mode === 'dropdown',
        'picker-inline': mode === 'inline',
        'small-mode': mode === 'dropdown' || mode === 'inline',
        'theme-green': theme === 'green',
        'theme-teal': theme === 'teal',
        'theme-grape': theme === 'grape',
        'theme-cyan': theme === 'cyan',
        'theme-red': theme === 'red',
        'theme-gray': theme === 'gray'}" [ngStyle]="getDialogStyle()"><div class="picker-box"><div class="picker-banner"><div class="picker-banner-day"><span [hidden]="dialogType === 0">{{ (selectedMoment? selectedMoment : now) | moment: 'dddd'}}</span> <span [hidden]="dialogType !== 0">{{ 'time picker' | translate }}</span></div><div class="picker-banner-moment"><div class="moment-date" *ngIf="pickerType === 'both' || pickerType === 'date'" (click)="toggleDialogType(1)"><div class="big"><span>{{(selectedMoment? selectedMoment : now) | moment: 'Do'}}</span></div><div class="small"><span>{{(selectedMoment? selectedMoment : now) | moment: 'MMM'}}</span> <span>{{(selectedMoment? selectedMoment : now) | moment: 'YYYY'}}</span></div></div><div class="moment-time" *ngIf="pickerType === 'both' || pickerType === 'time'" (click)="toggleDialogType(0)"><div class="big"><span *ngIf="hourTime === '12'">{{(selectedMoment? selectedMoment : now) | moment: 'hh:mm'}}</span> <span *ngIf="hourTime === '24'">{{(selectedMoment? selectedMoment : now) | moment: 'HH:mm'}}</span></div><div class="small" *ngIf="hourTime === '12'"><span>{{(selectedMoment? selectedMoment : now) | moment: 'A'}}</span></div></div></div></div><div class="picker-content"><dialog-date-panel *ngIf="pickerType === 'both' || pickerType === 'date'" [ngClass]="{hidden: dialogType === 0}" [selectedMoment]="selectedMoment" (onSelected)="setDate($event)" (onCancelDialog)="cancelDialog()" (onConfirm)="confirm($event)"></dialog-date-panel><dialog-time-panel *ngIf="pickerType === 'both' || pickerType === 'time'" [hidden]="dialogType !== 0" [dialogType]="dialogType" (onSetTime)="setTime($event)"></dialog-time-panel></div></div></div>`,
    styles: [`*,::after,::before{-moz-box-sizing:border-box;box-sizing:border-box}.picker-overlay{position:fixed;top:0;left:0;right:0;bottom:0;display:block;background-color:rgba(0,0,0,.3);z-index:999999}.picker-overlay.picker-overlay-dropdown{background-color:transparent}.picker-popup{position:fixed;top:0;left:50%;width:100vw;max-width:666px;height:100%;overflow:hidden;background-color:#fff;-moz-box-shadow:0 5px 15px rgba(0,0,0,.3);box-shadow:0 5px 15px rgba(0,0,0,.3);-moz-border-radius:5px;border-radius:5px;z-index:9999999;-webkit-transform:translate(-50%,0);-moz-transform:translate(-50%,0);-ms-transform:translate(-50%,0);transform:translate(-50%,0);-webkit-animation:slideDown .3s cubic-bezier(.13,.68,1,1.53);-moz-animation:slideDown .3s cubic-bezier(.13,.68,1,1.53);animation:slideDown .3s cubic-bezier(.13,.68,1,1.53)}@media only screen and (min-width:768px){.picker-popup{top:30px;height:auto}}.picker-dropdown{max-width:100vw;min-width:200px;border:#777 solid 1px;position:absolute;z-index:9999999;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-color:#fff;-moz-border-radius:5px;border-radius:5px;-webkit-animation:popover .3s ease-in-out;-moz-animation:popover .3s ease-in-out;animation:popover .3s ease-in-out}@media only screen and (min-width:768px){.picker-dropdown{max-width:300px}}.picker-inline{max-width:300px;min-width:200px;border:#777 solid 1px;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-color:#fff;-moz-border-radius:5px;border-radius:5px;display:inline-block}.picker-box{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;font-family:'Open Sans';width:100%;height:100%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.picker-banner{width:100%;background-color:#0070ba;color:#fff;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-moz-border-radius:4px 4px 0 0;border-radius:4px 4px 0 0}.picker-banner-day{font-size:21.328px;line-height:40px;text-align:center;background:rgba(0,0,0,.09)}.small-mode .picker-banner-day{font-size:12px;line-height:20px}.picker-banner-moment{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;width:100%}.picker-banner-moment .moment-date,.picker-banner-moment .moment-time{padding:0 8px;padding:0 .5rem;cursor:pointer}.picker-banner-moment .moment-date:hover,.picker-banner-moment .moment-time:hover{color:rgba(255,255,255,.65)}.picker-banner-moment .moment-date{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-flex:1;-webkit-flex-grow:1;-moz-box-flex:1;-ms-flex-positive:1;flex-grow:1;width:50%}@media only screen and (min-width:768px){.picker-banner-moment .moment-date{-webkit-box-pack:end;-webkit-justify-content:flex-end;-moz-box-pack:end;-ms-flex-pack:end;justify-content:flex-end}}.picker-banner-moment .moment-date .big,.picker-banner-moment .moment-date .small{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.picker-banner-moment .moment-date .big{font-size:50.56px;line-height:60px}.small-mode .picker-banner-moment .moment-date .big{font-size:21.328px;line-height:40px}.picker-banner-moment .moment-date .small{-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;padding:4.8px 8px;padding:.3rem .5rem;font-weight:300}.small-mode .picker-banner-moment .moment-date .small{font-size:8px;line-height:10px}.picker-banner-moment .moment-time{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;width:100%}.small-mode .picker-banner-moment .moment-time{width:50%;-webkit-box-pack:start;-webkit-justify-content:flex-start;-moz-box-pack:start;-ms-flex-pack:start;justify-content:flex-start}@media only screen and (min-width:768px){.picker-banner-moment .moment-time{width:50%;-webkit-box-pack:start;-webkit-justify-content:flex-start;-moz-box-pack:start;-ms-flex-pack:start;justify-content:flex-start}}.picker-banner-moment .moment-time .big,.picker-banner-moment .moment-time .small{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.picker-banner-moment .moment-time .big{font-size:37.92px;line-height:40px;font-weight:100}.small-mode .picker-banner-moment .moment-time .big{font-size:21.328px;line-height:40px}.picker-banner-moment .moment-time .small{font-size:21.328px;line-height:40px;padding:0 5px}.small-mode .picker-banner-moment .moment-time .small{font-size:12px;line-height:20px}.picker-content{-webkit-box-flex:1;-webkit-flex-grow:1;-moz-box-flex:1;-ms-flex-positive:1;flex-grow:1;width:100%;height:380px}.small-mode .picker-content{height:220px}.picker-content .hidden{display:none}.theme-green .picker-banner{background-color:#2b8a3e}.theme-green .bar .highlight{background:#2b8a3e!important}.theme-teal .picker-banner{background-color:#087f5b}.theme-teal .bar .highlight{background:#087f5b!important}.theme-cyan .picker-banner{background-color:#0b7285}.theme-cyan .bar .highlight{background:#0b7285!important}.theme-grape .picker-banner{background-color:#862e9c}.theme-grape .bar .highlight{background:#862e9c!important}.theme-red .picker-banner{background-color:#c92a2a}.theme-red .bar .highlight{background:#c92a2a!important}.theme-gray .picker-banner{background-color:#212529}.theme-gray .bar .highlight{background:#212529!important}@-webkit-keyframes popover{0%{opacity:0;-webkit-transform:translateY(-50px) scale(.8);transform:translateY(-50px) scale(.8)}80%{opacity:1;-webkit-transform:translateY(10px) scale(1.05);transform:translateY(10px) scale(1.05)}100%{opacity:1;-webkit-transform:translateY(0) scale(1);transform:translateY(0) scale(1)}}@-moz-keyframes popover{0%{opacity:0;-moz-transform:translateY(-50px) scale(.8);transform:translateY(-50px) scale(.8)}80%{opacity:1;-moz-transform:translateY(10px) scale(1.05);transform:translateY(10px) scale(1.05)}100%{opacity:1;-moz-transform:translateY(0) scale(1);transform:translateY(0) scale(1)}}@keyframes popover{0%{opacity:0;-webkit-transform:translateY(-50px) scale(.8);-moz-transform:translateY(-50px) scale(.8);transform:translateY(-50px) scale(.8)}80%{opacity:1;-webkit-transform:translateY(10px) scale(1.05);-moz-transform:translateY(10px) scale(1.05);transform:translateY(10px) scale(1.05)}100%{opacity:1;-webkit-transform:translateY(0) scale(1);-moz-transform:translateY(0) scale(1);transform:translateY(0) scale(1)}}@-webkit-keyframes slideDown{0%{opacity:0;-webkit-transform:translate(-50%,-100%);transform:translate(-50%,-100%)}100%{opacity:1;-webkit-transform:translate(-50%,0);transform:translate(-50%,0)}}@-moz-keyframes slideDown{0%{opacity:0;-moz-transform:translate(-50%,-100%);transform:translate(-50%,-100%)}100%{opacity:1;-moz-transform:translate(-50%,0);transform:translate(-50%,0)}}@keyframes slideDown{0%{opacity:0;-webkit-transform:translate(-50%,-100%);-moz-transform:translate(-50%,-100%);transform:translate(-50%,-100%)}100%{opacity:1;-webkit-transform:translate(-50%,0);-moz-transform:translate(-50%,0);transform:translate(-50%,0)}}`],
    providers: [PickerService, TRANSLATION_PROVIDERS, TranslateService],
})
export class DialogComponent implements OnInit, OnDestroy {

    private selectedMoment: Moment;
    private directiveInstance: any;
    private directiveElementRef: ElementRef;
    private top: number;
    private left: number;
    private width: string;
    private height: string = 'auto';
    private position: string;

    public show: boolean;
    public initialValue: string;
    public date: string;
    public now: Moment;
    public theme: string;
    public hourTime: '12' | '24';
    public positionOffset: string;
    public mode: 'popup' | 'dropdown' | 'inline';
    public returnObject: string;
    public dialogType: DialogType;
    public pickerType: 'both' | 'date' | 'time';
    public minDate: string;
    public maxDate: string;

    private subId: Subscription;

    constructor( private el: ElementRef,
                 private translate: TranslateService,
                 private service: PickerService ) {
    }

    public ngOnInit() {
        this.theme = this.service.dtTheme;
        this.hourTime = this.service.dtHourTime;
        this.positionOffset = this.service.dtPositionOffset;
        this.mode = this.service.dtMode;
        this.returnObject = this.service.dtReturnObject;
        this.pickerType = this.service.dtPickerType;
        this.minDate = this.service.dtMinDate;
        this.maxDate = this.service.dtMaxDate;
        this.translate.use(this.service.dtLocale);
        moment.locale(this.service.dtLocale);

        // set now value
        this.now = moment();
        this.subId = this.service.events.subscribe(
            ( selectedMoment: Moment ) => {
                this.selectedMoment = selectedMoment;
            }
        );
        this.openDialog(this.initialValue);
    }

    public ngOnDestroy(): void {
        if (this.subId) {
            this.subId.unsubscribe();
        }
    }

    public openDialog( moment: any ): void {
        this.show = true;

        if (this.mode === 'dropdown') {
            this.setDialogPosition();
        } else if (this.mode === 'inline') {
            this.setInlineDialogPosition();
        }
        this.dialogType = this.service.dtDialogType;
        this.setSelectedMoment(moment);
        return;
    }

    public setSelectedMoment( moment: any ): void {
        this.service.setMoment(moment);
    }

    public cancelDialog(): void {
        this.show = false;
        return;
    }

    public setInitialMoment( value: any ) {
        this.initialValue = value;
    }

    public setDialog( instance: any, elementRef: ElementRef, initialValue: any, dtLocale: string, dtViewFormat: string, dtReturnObject: string,
                      dtPositionOffset: string, dtMode: 'popup' | 'dropdown' | 'inline',
                      dtHourTime: '12' | '24', dtTheme: string, dtPickerType: 'both' | 'date' | 'time', dtMinDate: string, dtMaxDate: string ): void {
        this.directiveInstance = instance;
        this.directiveElementRef = elementRef;
        this.initialValue = initialValue;

        this.service.setPickerOptions(dtLocale, dtViewFormat, dtReturnObject,
            dtPositionOffset, dtMode, dtHourTime, dtTheme, dtPickerType, dtMinDate, dtMaxDate);
    }

    public confirm( close: boolean ): void {
        this.returnSelectedMoment();
        if (close === true) {
            this.cancelDialog();
        } else {
            this.dialogType = this.service.dtDialogType;
        }
    }

    public toggleDialogType( type: DialogType ): void {
        if (this.pickerType !== 'both') {
            return;
        }
        if (this.dialogType === type) {
            this.dialogType = DialogType.Date;
        } else {
            this.dialogType = type;
        }
    }

    public setDate( moment: Moment ): void {
        this.service.setDate(moment);
        this.confirm(false);
    }

    public setTime( time: { hour: number, min: number, meridian: string } ): void {
        this.service.setTime(time.hour, time.min, time.meridian);
        if (this.service.dtPickerType === 'time') {
            this.confirm(true);
        } else {
            this.confirm(false);
        }
    }

    public getDialogStyle(): any {
        if (this.mode === 'popup') {
            return {}
        } else {
            return {
                'width': this.width,
                'height': this.height,
                'top.px': this.top,
                'left.px': this.left,
                'position': this.position
            };
        }
    }

    private setDialogPosition() {
        if (window.innerWidth < 768) {
            this.position = 'fixed';
            this.top = 0;
            this.left = 0;
            this.width = '100%';
            this.height = '100%';
        } else {
            let node = this.directiveElementRef.nativeElement;
            let position = 'static';
            let transform;
            let parentNode: any = null;
            let boxDirective;

            while (node !== null && node.tagName !== 'HTML') {
                position = window.getComputedStyle(node).getPropertyValue("position");
                transform = window.getComputedStyle(node).getPropertyValue("-webkit-transform");
                if (position !== 'static' && parentNode === null) {
                    parentNode = node;
                }
                if (position === 'fixed') {
                    break;
                }
                node = node.parentNode;
            }

            if (position !== 'fixed' || transform) {
                boxDirective = this.createBox(this.directiveElementRef.nativeElement, true);
                if (parentNode === null) {
                    parentNode = node
                }
                let boxParent = this.createBox(parentNode, true);
                this.top = boxDirective.top - boxParent.top;
                this.left = boxDirective.left - boxParent.left;
            } else {
                boxDirective = this.createBox(this.directiveElementRef.nativeElement, false);
                this.top = boxDirective.top;
                this.left = boxDirective.left;
                this.position = 'fixed';
            }

            this.top += boxDirective.height + 3;
            this.left += parseInt(this.positionOffset) / 100 * boxDirective.width;
            this.width = this.directiveElementRef.nativeElement.offsetWidth + 'px';
        }
    }

    private setInlineDialogPosition() {
        this.position = 'relative';
        this.width = this.directiveElementRef.nativeElement.offsetWidth + 'px';
    }

    private createBox( element: any, offset: boolean ) {
        return {
            top: element.getBoundingClientRect().top + (offset ? window.pageYOffset : 0),
            left: element.getBoundingClientRect().left + (offset ? window.pageXOffset : 0),
            width: element.offsetWidth,
            height: element.offsetHeight
        };
    }

    private returnSelectedMoment(): void {
        let m = this.selectedMoment || this.now;
        let selectedM = this.service.parseToReturnObjectType(m);
        this.directiveInstance.momentChanged(selectedM);
    }
}

export enum DialogType {
    Time,
    Date,
    Month,
    Year,
}
