import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { GaugeComponent } from "./components/gauge/gauge.component";
import { TemperatureConfig } from './models/temperature-config';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GaugeComponent, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'temepature-gauge';

  readonly unsub$ = new Subject<void>();

  temperatureConfig: TemperatureConfig = {
    minTemp: 0,
    maxTemp: 100,
    currentTemp: 20
  };

  form = new FormGroup({
    minTemp: new FormControl(this.temperatureConfig?.minTemp),
    maxTemp: new FormControl(this.temperatureConfig?.maxTemp),
    currentTemp: new FormControl(this.temperatureConfig?.currentTemp)
  });

  ngOnInit() {
    this.form.valueChanges
    .pipe(takeUntil(this.unsub$))
    .subscribe(changes => {
      this.temperatureConfig = {
        minTemp: changes.minTemp as number,
        maxTemp: changes.maxTemp as number,
        currentTemp: changes.currentTemp as number
      };
    });
  }

  ngOnDestroy(): void {
    this.unsub$.next();
    this.unsub$.complete();
  }
}
