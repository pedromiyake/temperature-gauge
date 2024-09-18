import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemperatureConfig } from '../../models/temperature-config';

@Component({
  selector: 'app-gauge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gauge.component.html',
  styleUrl: './gauge.component.scss'
})
export class GaugeComponent implements OnChanges {
  @Input() temperatureConfig: TemperatureConfig = {
    minTemp: 0,
    maxTemp: 100,
    currentTemp: 0,
  };

  minTempAngle = -225;
  maxTempAngle = 45;
  pointerAngle = -225;

  errorMessage: string | null = null;

  private INVALID_TEMP_CONFIG = 'Temperature configuration is not valid.';
  private MIN_MAX_TEMP_ERROR = 'Max temperature must be greater than min temperature.';
  private CURRENT_TEMP_BELOW_MIN_ERROR = 'Current temperature is below minimum.';
  private CURRENT_TEMP_ABOVE_MAX_ERROR = 'Current temeprature is above maximum.';

  ngOnChanges(changes: SimpleChanges): void {
    if ('temperatureConfig' in changes) {
      const isConfigValid = this.isTemperatureConfigValid(this.temperatureConfig!);
      
      if (isConfigValid) {
        this.pointerAngle = this.calculatePointerAngle(this.temperatureConfig!);
      }
    }
  }

  private calculatePointerAngle(temperatureConfig: TemperatureConfig): number {
    const totalAngleDelta = this.maxTempAngle - this.minTempAngle;
    const totalTempDelta = temperatureConfig.maxTemp - temperatureConfig.minTemp;
    const currentTempDelta = temperatureConfig.currentTemp - temperatureConfig.minTemp;
    
    return (currentTempDelta * totalAngleDelta / totalTempDelta) + this.minTempAngle;
  }

  private isTemperatureConfigValid(temperatureConfig: TemperatureConfig): boolean {
    if (!temperatureConfig) {
      this.errorMessage = this.INVALID_TEMP_CONFIG;
      return false;
    }

    if (temperatureConfig.maxTemp < temperatureConfig.minTemp) {
      this.errorMessage = this.MIN_MAX_TEMP_ERROR
      return false;
    }

    if (temperatureConfig.currentTemp > temperatureConfig.maxTemp) {
      this.errorMessage = this.CURRENT_TEMP_ABOVE_MAX_ERROR;
      return false;
    }

    if (temperatureConfig.currentTemp < temperatureConfig.minTemp) {
      this.errorMessage = this.CURRENT_TEMP_BELOW_MIN_ERROR;
      return false;
    }

    this.errorMessage = null;

    return true;
  }
}
