import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

import { Patient } from './patient.model';

@Injectable({ providedIn: 'root' })
export class PatientService {
  error = new Subject<string>();
  apikey = 'wFIMP75eG1sQEh8vVAdXykgzF4mLhDw3';
  patient_id: string = 'AzuZhnF7czoQ8GyEz0ZWyw==';

  constructor(private http: HttpClient) {}

  createPatient(patientData: Patient) {
    this.http
      .post<{
        status_code: string;
        status_message: string;
        datetime: string;
        data: { patient_id: string };
      }>('https://dev-api.evitalrx.in/v1/fulfillment/patients/add', {
        ...patientData,
        apikey: this.apikey,
      })
      .subscribe(
        (response) => {
          localStorage.setItem('patient_id', response.data.patient_id);
        },
        (error) => {
          this.error.next(error.message);
        }
      );
  }

  fetchPatients() {
    const storedPatientId = localStorage.getItem('patient_id');
    console.log('storedPatientId', storedPatientId);
    this.patient_id = storedPatientId!;
    return this.http
      .post('https://dev-api.evitalrx.in/v1/fulfillment/patients/view', {
        apikey: this.apikey,
        patient_id: this.patient_id,
      })
      .pipe(
        delay(2000),
        map((response: any) => response.data),
        catchError((errorRes) => {
          const errorMessage =
            errorRes.error?.message || 'An unknown error occurred!';
          // this.error.next(errorMessage);
          console.error('Error fetching patients:', errorRes);

          return throwError(errorRes);
        })
      );
  }
}
