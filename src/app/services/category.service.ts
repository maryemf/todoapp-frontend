import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { Category } from './../models';
import { handleError } from './handleOperationError';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]>{
    return this.http.get<Category[]>(`${environment.apiURL}/categories`)
      .pipe(
        catchError(handleError<Category[]>('getCategories', []))
      );
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${environment.apiURL}/categories/${id}`)
    .pipe(
      tap(_ => console.log(`fetched category id=${id}`)),
      catchError(handleError<Category>(`getCategory id=${id}`))
    );
  }

  addCategory(data: Category): Observable<Category> {
    return this.http.post<Category>(`${environment.apiURL}/categories`, data)
    .pipe(
      tap((newCategory: any) => console.log(`added category w/ id=${newCategory.data.id}`)),
      catchError(handleError<Category>('addCategory'))
    );
  }

  updateCategory(data: Category, id: number): Observable<Category> {
    return this.http.put<Category>(`${environment.apiURL}/categories/${id}`, data)
    .pipe(
      tap(_ => console.log(`update category id=${id}`)),
      catchError(handleError<Category>(`updateCategory id=${id}`))
    );
  }

  deleteCategory(id:number): Observable<{}> {
    return this.http.delete(`${environment.apiURL}/categories/${id}`)
    .pipe(
      tap(_ => console.log(`delete category id=${id}`)),
      catchError(handleError<Category>(`deleteCategory id=${id}`))
    );
  }

}
