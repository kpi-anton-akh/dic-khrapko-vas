export type IFindConditions<Entity> = {
  [Key in keyof Entity]?: Entity[Key];
};
