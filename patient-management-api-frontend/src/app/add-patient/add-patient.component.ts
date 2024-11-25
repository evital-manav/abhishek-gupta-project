import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CanComponentDeactivate } from './can-deactivate-guard.service';
import { Observable, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PatientService } from '../patient.service';
import { Router } from '@angular/router';
import { CustomSnackbarComponent } from '../shared/custom-snackbar/custom-snackbar.component';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css'],
})
export class AddPatientComponent implements OnInit, CanComponentDeactivate {
  patientForm!: FormGroup;
  isFormSubmitted = false;
  PatientData!: '';
  errorSub!: Subscription;

  constructor(
    private patientService: PatientService,
    private router: Router,

    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.patientForm = new FormGroup({
      zipcode: new FormControl('', Validators.pattern('^[0-9]{6}$')),
      mobile: new FormControl('', [
        Validators.required,
        Validators.pattern('^(?:[1-9][0-9]{9})$'),
 
      ]),
      first_name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[A-Za-z]+$'),
      ]),
      last_name: new FormControl('', [
        Validators.minLength(3),
        Validators.pattern('^[A-Za-z]+$'),
      ]),
      dob: new FormControl('', [
        Validators.pattern(
          '^(19|20)\\d\\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$'
        ),
      ]),
      gender: new FormControl('', Validators.required),
      blood_group: new FormControl('', [
        Validators.maxLength(3),
        Validators.pattern('^[ABO]{1,2}[+-]$'),
      ]),
    });

    const savedPatientData = localStorage.getItem('patientFormData');
    if (savedPatientData) {
      this.patientForm.patchValue(JSON.parse(savedPatientData));
    }
    this.errorSub = this.patientService.error.subscribe((errorMessage) => {
      alert(errorMessage);
    });
    this.patientForm.valueChanges.subscribe((value) => {
      const { mobile, ...dataToSave } = value;
      localStorage.setItem('patientFormData', JSON.stringify(dataToSave));
    });
  }
  onCancel() {
    this.router.navigate(['/view-patient']);
  }

  onReset() {
    this.patientForm.reset();
  
   
  }

  onSubmit(): void {
    if (this.patientForm.valid) {
      this.isFormSubmitted = true;
      this.PatientData = this.patientForm.value;
      if (this.PatientData) {
        this.onReset();
        this.patientService.createPatient(this.patientForm.value);
        const snackBarRef = this._snackBar.openFromComponent(CustomSnackbarComponent, {
          data: { message: 'Form submitted successfully!' },
          duration: 3000, 
          panelClass: ['custom-snackbar'], 
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
        });
  
        snackBarRef.instance.startProgress(3000);
      }

      localStorage.removeItem('patientFormData');
      
    } else {
      console.log('Form is invalid!');
    }
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (
      !this.isFormSubmitted &&
      this.patientForm.touched &&
      this.patientForm.dirty
    ) {
      return confirm('Do you want to discard the changes?');
    } else {
      return true;
    }
  }
  preventExtraDigits(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;

   
    if (currentValue.length >= 10) {
      event.preventDefault(); 
    }
  }
}
