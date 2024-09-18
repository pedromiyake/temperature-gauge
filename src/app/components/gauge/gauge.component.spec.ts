import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaugeComponent } from './gauge.component';
import { TemperatureConfig } from '../../models/temperature-config';
import { SimpleChange, SimpleChanges } from '@angular/core';

describe('GaugeComponent', () => {
  let component: GaugeComponent;
  let fixture: ComponentFixture<GaugeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GaugeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should detect valid temeprature config changes', () => {
    // given
    const validTempConfig = {
      minTemp: 0,
      maxTemp: 100,
      currentTemp: 50
    };
    component.temperatureConfig = { ...validTempConfig };

    const mockChanges: SimpleChanges = {
      temperatureConfig: { 
        currentValue: validTempConfig
      } as SimpleChange
    }

    const calculateAngleSpy = spyOn(component, 'calculatePointerAngle' as never).and.callThrough();

    // when
    component.ngOnChanges(mockChanges);

    // then
    expect(calculateAngleSpy).toHaveBeenCalled();
    expect(component.errorMessage).toBeNull();
  });

  it('should detect invalid temeprature config changes', () => {
    // given
    const validTempConfig = {
      minTemp: 0,
      maxTemp: -100,
      currentTemp: 50
    };
    component.temperatureConfig = { ...validTempConfig };

    const mockChanges: SimpleChanges = {
      temperatureConfig: { 
        currentValue: validTempConfig
      } as SimpleChange
    }

    const calculateAngleSpy = spyOn(component, 'calculatePointerAngle' as never).and.callThrough();

    // when
    component.ngOnChanges(mockChanges);

    // then
    expect(calculateAngleSpy).not.toHaveBeenCalled();
    expect(component.errorMessage).toBeTruthy();
  });

  it('should calculate corret angle for valid temperature config', () => {
    // given
    const validTempConfig: TemperatureConfig = {
      minTemp: 0,
      maxTemp: 100,
      currentTemp: 50
    };
    const expectedAngle = -90;

    // when
    const result = component['calculatePointerAngle'](validTempConfig);

    // then
    expect(result).toEqual(expectedAngle);
    expect(component.errorMessage).toBeNull();
  });

  describe('error cases', () => {
    it ('should display invalid temeprature configurration error message', () => {
      // given
      const expectedErrorMessage = component['INVALID_TEMP_CONFIG'];
      const invalidTempConfig = null;

      // when
      const result = component['isTemperatureConfigValid'](invalidTempConfig as unknown as TemperatureConfig);

      // then
      expect(result).toBeFalse();
      expect(component.errorMessage).toEqual(expectedErrorMessage);
    });

    it('should display current temperature below min temperature error message', () => {
      // given
      const expectedErrorMessage = component['CURRENT_TEMP_BELOW_MIN_ERROR'];
      const invalidTempConfig: TemperatureConfig = {
        minTemp: 0,
        maxTemp: 100,
        currentTemp: -50
      };

      // when
      const result = component['isTemperatureConfigValid'](invalidTempConfig);

      // then
      expect(result).toBeFalse();
      expect(component.errorMessage).toEqual(expectedErrorMessage);
    });

    it('should display current temperature above max temperature error message', () => {
      // given
      const expectedErrorMessage = component['CURRENT_TEMP_ABOVE_MAX_ERROR'];
      const invalidTempConfig: TemperatureConfig = {
        minTemp: 0,
        maxTemp: 100,
        currentTemp: 150
      };

      // when
      const result = component['isTemperatureConfigValid'](invalidTempConfig);

      // then
      expect(result).toBeFalse();
      expect(component.errorMessage).toEqual(expectedErrorMessage);
    });

    it('should display max temperature below min temperature error message', () => {
      // given
      const expectedErrorMessage = component['MIN_MAX_TEMP_ERROR'];
      const invalidTempConfig: TemperatureConfig = {
        minTemp: 100,
        maxTemp: 0,
        currentTemp: 50
      };

      // when
      const result = component['isTemperatureConfigValid'](invalidTempConfig);

      // then
      expect(result).toBeFalse();
      expect(component.errorMessage).toEqual(expectedErrorMessage);
    });
  })
});
