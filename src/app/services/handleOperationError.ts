import { Observable, of } from "rxjs";
import Swal from 'sweetalert2';

export function handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
    console.error('en handler', error); // TODO loggin system

    Swal.fire({
      title: '¡Ha ocurrido un Error!',
      text: `Operación: ${operation}. Error: ${error.error.message}`,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });

    return of(result as T);
  };
}
