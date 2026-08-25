interface BaseEntity {
  internalId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

type RelationKeys<Entity> = {
  [Key in keyof Entity]: Key extends `${string}Id` ? Key : never;
}[keyof Entity];

export type InputDb<T extends BaseEntity> = Omit<T, keyof BaseEntity | RelationKeys<T>>;
