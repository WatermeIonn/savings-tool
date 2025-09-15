import { Input } from "@/classes/Input";

export function inputsToDto<T>(inputs: Input[], id?: string): T {
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

export function inputsToCustomVars(inputs: Input[]): { [key: string]: string } {
  let customVars: { [key: string]: string } = {};

  for (const input of inputs) {
    if (!input.isCustomVar) {
      continue;
    }

    customVars[input.name] = input.getValue();
  }

  return customVars;
}