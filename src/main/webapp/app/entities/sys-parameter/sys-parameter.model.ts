export interface ISysParameter {
  id: number;
  key?: string | null;
  value?: string | null;
}

export type NewSysParameter = Omit<ISysParameter, 'id'> & { id: null };
