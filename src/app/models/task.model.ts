export interface Task {
  id?: number,
  name: string,
  description?: string,
  start_date?: Date,
  end_date?: Date,
  is_complete?: boolean,
  completed_date?: Date,
  categories?: Array<any>
}
