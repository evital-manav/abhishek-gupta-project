import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-snackbar',
  templateUrl: './custom-snackbar.component.html',
  styleUrls: ['./custom-snackbar.component.css'],
})
export class CustomSnackbarComponent {
  progressValue: number = 0;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string }) {}

  startProgress(duration: number) {
    this.progressValue = 0;
    const interval = setInterval(() => {
      this.progressValue += 10;
      if (this.progressValue >= 100) {
        clearInterval(interval);
      }
    }, duration / 10);
  }
}
