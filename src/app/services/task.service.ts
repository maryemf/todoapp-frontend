import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { handleError } from './handleOperationError';
import { Task } from './../models/task.model';


@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Task[]>{
    return this.http.get<Task[]>(`${environment.apiURL}/tasks`)
      .pipe(
        catchError(handleError<Task[]>('getTasks', []))
      );
  }

  getTaskByCategory(id: number): Observable<Task[]>{
    return this.http.get<Task[]>(`${environment.apiURL}/tasks/category/${id}`)
      .pipe(
        catchError(handleError<Task[]>('getTaskByCategory', []))
      );
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${environment.apiURL}/tasks/${id}`)
    .pipe(
      tap(_ => console.log(`fetched Task id=${id}`)),
      catchError(handleError<Task>(`getTask id=${id}`))
    );
  }


  addTask(data: Task): Observable<Task> {
    return this.http.post<Task>(`${environment.apiURL}/tasks`, data)
    .pipe(
      tap((newTask: any) => console.log(`added Task w/ id=${newTask.data.id}`)),
      catchError(handleError<Task>('addTask'))
    );
  }

  updateTask(data: Task, id: number): Observable<Task> {
    return this.http.put<Task>(`${environment.apiURL}/tasks/${id}`, data)
    .pipe(
      tap(_ => console.log(`update Task id=${id}`)),
      catchError(handleError<Task>(`updateTask id=${id}`))
    );
  }

  deleteTask(id:number): Observable<{}> {
    return this.http.delete(`${environment.apiURL}/tasks/${id}`)
    .pipe(
      tap(_ => console.log(`delete Task id=${id}`)),
      catchError(handleError<Task>(`deleteTask id=${id}`))
    );
  }
}
