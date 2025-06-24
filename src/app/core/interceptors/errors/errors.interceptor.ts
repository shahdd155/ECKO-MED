import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService)
  return next(req).pipe(
    catchError((error)=>{
      console.log(error);
      if(error.status === 0){ 
toastr.error('no network connection')
      }
      return throwError(()=>error)
    })
  );
};
