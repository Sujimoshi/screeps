import creeps from "./creeps";
import { MinerController } from "creeps/miner";
import { ErrorMapper } from "utils/ErrorMapper";
import { isNewVersion, updateVersion } from "utils/version";

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */
  // Memory extension samples
  interface Memory {
    version: string;
    uuid: number;
    i: any[];
  }

  interface CreepMemory {
    target?: any
    role: string;
    state: any
  }

  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

const creepProcessor = (creep: Creep) => {
  if (creep.memory.role) (creeps as any)[creep.memory.role].run(creep)
}

const roomProcessor = (room: Room) => {
  MinerController.process(room)
}

export const loop = ErrorMapper.wrapLoop(() => {
  for (const name in Game.creeps) {
    creepProcessor(Game.creeps[name])
  }

  for (const name in Game.rooms) {
    roomProcessor(Game.rooms[name])
  }

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  if (isNewVersion()) {
    console.log('New changes pushed')
    updateVersion()
  }
});
