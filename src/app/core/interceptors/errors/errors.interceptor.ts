import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService)
  return next(req).pipe(
    catchError((error)=>{
      console.log(error);
      
      // Network connection error
      if(error.status === 0){ 
        toastr.error('No network connection. Please check your internet connection.', '', { timeOut: 1000 });
      }
      else if(error.status === 400) {
        toastr.error('Bad request. Please check your input and try again.', '', { timeOut: 1000 });
      }
      else if(error.status === 401) {
        // Optionally, you can just return here and not show any message
        const errorMessage = error.error?.message || error.message || 'Unauthorized access';
        console.error('401 Error:', errorMessage);
        return throwError(() => error);
      }
      else if(error.status === 403) {
        toastr.error('Access forbidden. You don\'t have permission to perform this action.', '', { timeOut: 1000 });
      }
      else if(error.status === 404) {
        toastr.error('Resource not found. The requested data could not be located.', '', { timeOut: 1000 });
      }
      else if(error.status === 409) {
        toastr.error('Conflict. The request conflicts with the current state of the resource.', '', { timeOut: 1000 });
      }
      else if(error.status === 422) {
        toastr.error('Validation error. Please check your input data.', '', { timeOut: 1000 });
      }
      else if(error.status === 500) {
        toastr.error('Internal server error. Please try again later.', '', { timeOut: 1000 });
      }
      else if(error.status === 502) {
        toastr.error('Bad gateway. The server is temporarily unavailable.', '', { timeOut: 1000 });
      }
      else if(error.status === 503) {
        toastr.error('Service unavailable. The server is temporarily down for maintenance.', '', { timeOut: 1000 });
      }
      else if(error.status === 504) {
        toastr.error('Gateway timeout. The request took too long to complete.', '', { timeOut: 1000 });
      }
      
      else {
        toastr.error('An error occurred (${error.status}). Please try again.', '', { timeOut: 1000 });
      }
      
      return throwError(()=>error)
    })
  );
};
