import { Component, OnDestroy, OnInit } from '@angular/core';
import { PatientService } from '../patient.service';
import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger,
} from '@angular/animations';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-patient',
  templateUrl: './view-patient.component.html',
  styleUrls: ['./view-patient.component.css'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
       
        query(
          '.patient-card',
          style({ transform: 'translateY(-50px)', opacity: 0 })
        ),
       
        query(
          '.patient-card',
          stagger('100ms', [
            animate(
              '800ms ease-in-out',
              style({ transform: 'translateY(0)', opacity: 1 })
            ),
          ])
        ),
      ]),
    ]),
  ],
})
export class ViewPatientComponent implements OnInit, OnDestroy {
  loadedPatients: any = [];
  isFetching = false;
  error = '';
  private errorSub!: Subscription;

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.errorSub = this.patientService.error.subscribe((errorMessage) => {
      this.error = errorMessage;
      console.log('error occured', this.error);
    });

    this.isFetching = true;
    this.patientService.fetchPatients().subscribe(
      (patientData) => {
        this.isFetching = false;
        this.loadedPatients = patientData;
        console.log('fetched patient data', this.loadedPatients);
      },
      (error) => {
        this.isFetching = false;
        this.error = `Error occurred! Unable to fetch record: ${
          error.message || error
        }`;
        console.log('error occured', this.error);
      }
    );
  }
  onClose() {
    this.error = '';
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }
}
