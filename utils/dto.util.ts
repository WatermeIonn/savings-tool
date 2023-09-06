import { FormInputTypeEnum } from "@/enums/FormInputTypeEnum";
import { FormInputInterface } from "@/interfaces/FormInputInterface";

export function inputsToDto<T>(
  inputs: FormInputInterface[],
  type: new () => T
): T {
  const dto: any = new type();

  debugger;
  for (const input of inputs) {
    switch (input.type) {
      case FormInputTypeEnum.Number:
        dto[input.name] = Number(input.value);
        break;
      case FormInputTypeEnum.String:
      default:
        dto[input.name] = input.value;
    }
  }

  return dto;
}
