import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import * as dayjs from 'dayjs';

@ValidatorConstraint({ name: "isAdult", async: false })
export class IsAdultConstraint implements ValidatorConstraintInterface {

  validate(propertyValue: string, args: ValidationArguments) {
    return dayjs(propertyValue).unix() < dayjs().subtract(18, 'year').unix();
  }

  defaultMessage(args: ValidationArguments) {
    return 'You have to be 18 or above to register.';
  }

}
