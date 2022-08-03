export interface Tickable {
  preTick (): void
  postTick (): void
}
