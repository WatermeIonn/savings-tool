import { BaseInput } from "@/classes/BaseInput";

export function inputsToDto<T>(inputs: BaseInput[]): T {
  let dto: any = {};

  for (const input of inputs) {
    if (input.isComputed) {
      continue;
    }

    dto[input.name] = input.getValue();
  }

  return dto as T;
}
