import { OnInit, EventEmitter } from '@angular/core';
import { Moment } from 'moment/moment';
import { DialogType } from './dialog.component';
import { PickerService } from './picker.service';
export declare class TimePanelComponent implements OnInit {
    private service;
    dialogType: DialogType;
    onSetTime: EventEmitter<{
        hour: number;
        min: number;
        meridian: string;
    }>;
    hourValue: number;
    minValue: number;
    meridianValue: string;
    hourFloor: number;
    hourCeiling: number;
    moment: Moment;
    hourTime: '12' | '24';
    theme: string;
    mode: 'popup' | 'dropdown' | 'inline';
    constructor(service: PickerService);
    ngOnInit(): void;
    setMeridian(meridian: string): void;
    setTime(): void;
}
