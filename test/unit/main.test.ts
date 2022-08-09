import {assert} from "chai";
import { Task, TaskManager, TaskRequest } from "../../src/core/TaskManager";
import {loop} from "../../src/main";
import { HasBodyPart } from "../../src/tasks/conditions";
import {Game, Memory} from "./mock"

describe("main", () => {
  before(() => {
    // runs before all test in this block
  });

  beforeEach(() => {
    // runs before each test in this block
    // @ts-ignore : allow adding Game to global
    global.Game = _.clone(Game);
    // @ts-ignore : allow adding Memory to global
    global.Memory = _.clone(Memory);
  });

  it('stable match test', () => {
    const { Person, stableMarriage, shuffle } = require('stable-marriage')

    const boys = [{ name: 'A' }, { name: 'B' }, { name: 'C' }].map((name) => new Person(name))
    const girls = [{ name: 'a' }, { name: 'b' }, { name: 'c' }].map((name) => new Person(name))

    console.log('boys')
    for (const boy of boys) {
      boy.generatePreferences(shuffle(girls))
      console.log(`${boy.name.name}: ${boy.preferences.map((p: any) => p.name.name).join()}`)
    }
    console.log('\nGirls')
    for (const girl of girls) {
      girl.generatePreferences(shuffle(boys))
      console.log(`${girl.name.name}: ${girl.preferences.map((p: any) => p.name.name).join()}`)
    }

    stableMarriage(boys)

    console.log('\nPairings')
    for (const boy of boys) {
      if (boy.fiance) {
        console.log(`${boy.name.name}: ${boy.fiance.name.name}`)
      }
    }
  })

  class MockTask extends Task {

    constructor(public name: string, public part: string) {
        super()
    }

    conditions = (creep: Creep) => [
        new HasBodyPart(this.part as any)
    ]

    action = (creep: Creep) => {
        return 0
    }

    cost = (creep: Creep) => 10

  }

  // it("should export a loop function", () => {
  //   const tm = new TaskManager()
  //   tm.addRequest({
  //     creator: { id: '1' },
  //     task: new MockTask('pickup', 'carry'),
  //     priority: 10,
  //     fulfilled: () => false
  //   })
  //   tm.addRequest({
  //     creator: { id: '2' },
  //     task: new MockTask('pickup', 'carry'),
  //     priority: 10,
  //     fulfilled: () => false
  //   })
  //   tm.addRequest({
  //     creator: { id: '3' },
  //     task: new MockTask('harvest', 'work'),
  //     priority: 5,
  //     fulfilled: () => false
  //   })
  //   tm.addRequest({
  //     creator: { id: '4' },
  //     task: new MockTask('harvest', 'work'),
  //     priority: 5,
  //     fulfilled: () => false
  //   })

  //   tm.processRequests([
  //     { id: 'worker1', getActiveBodyparts: (type: any) => ['work', 'carry', 'move'].filter(el => el === type).length } as any,
  //     { id: 'worker2', getActiveBodyparts: (type) => ['work', 'carry', 'move'].filter(el => el === type).length },
  //     // { id: 'miner', getActiveBodyparts: (type) => ['work', 'work', 'move'].filter(el => el === type).length },
  //   ])
  // });

});


// [14:32:50]ctr [creep worker384628],PickupTask,PickupTask,PickupTask,PickupTask,HarvestTask,HarvestTask
// [14:32:50][creep worker384628] PickupTask10,PickupTask10,PickupTask10,PickupTask10,HarvestTask5,HarvestTask5
// [14:32:51]W9N9
// [14:32:52]W9N9
// [14:32:53]W9N9
// [14:32:53]Error: Task TransferTask returned -8 (not 0) terminating task
// [14:32:53]Error: Task TransferTask returned -8 (not 0) terminating task
// [14:32:53]ctr [creep worker383183],UpgradeTask,PickupTask,PickupTask,PickupTask,PickupTask,[creep worker383986],HarvestTask,HarvestTask
// [14:32:53][creep worker383183] UpgradeTask15,PickupTask10,PickupTask10,PickupTask10,PickupTask10
// [14:32:53][creep worker383986] HarvestTask5,HarvestTask5
// [14:32:54]W9N9
// [14:32:55]W9N9
