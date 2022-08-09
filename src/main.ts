import { ErrorMapper } from "./utils/ErrorMapper";
import { TaskManager } from "./core/TaskManager";
import { TaskRequestQueue } from "./core/TaskManager/queue";
import { Container } from "./core/Container";
import { RoomContext, roomLoop } from "./room";
import { EconomyAnalyzerRepository } from "./core/EconomyAlanyzer";

console.log('New changes where pushed');

export interface Dependencies {
  taskManager: TaskManager
  taskQueue: TaskRequestQueue
  economyAnalyzerRepository: EconomyAnalyzerRepository
}

export type App = Container<Dependencies>

export type Provider = (deps: Dependencies, app: App) => void

const app: App = new Container()

app.singleton('taskManager', () => new TaskManager())

app.factory('taskQueue', () => new TaskRequestQueue())

app.singleton('economyAnalyzerRepository', () => new EconomyAnalyzerRepository())

global.app = app

export const loop = ErrorMapper.wrapLoop(() => {

  app.use(roomLoop(app.context = {}))

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

});
