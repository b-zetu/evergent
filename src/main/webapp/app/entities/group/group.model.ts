export interface IGroup {
  id: number;
  name?: string | null;
  code?: string | null;
}

export type NewGroup = Omit<IGroup, 'id'> & { id: null };
