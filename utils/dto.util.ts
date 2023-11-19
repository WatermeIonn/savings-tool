import { BaseInput } from "@/classes/BaseInput";

export function inputsToDto<T>(inputs: BaseInput[], id?: string): T {
  let dto: any = {};

  for (const input of inputs) {
    if (input.isComputed) {
      continue;
    }

    dto[input.name] = input.getValue();
  }

  if(id){
    dto.id = id;
  }

  return dto as T;
}
