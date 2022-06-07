import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';

@Directive({
  selector: '[isLessThanStartDate]',
  providers: [{provide: NG_VALIDATORS, useExisting: EndDateValidatorDirective, multi: true}]
})
export class EndDateValidatorDirective implements Validator {
  @Input('isLessThanStartDate') shouldbeless: any;
  constructor() { }

  validate(control: AbstractControl): {[key: string]: any} | null {
    if (this.shouldbeless && control.value){
      const sDate = new Date(this.shouldbeless.year, (this.shouldbeless.month - 1), this.shouldbeless.day);
      const eDate = new Date(control.value.year, (control.value.month - 1), control.value.day);
      // console.log(sDate, eDate);
      return (sDate > eDate) ? {'isMoreThanStartDate': true} : null;
    }
    return null;
  }

}
