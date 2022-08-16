import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { NotificationService } from '../notification.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class ErrorPrintInterceptor implements HttpInterceptor {
  constructor(private readonly notificationService: NotificationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {

    return next.handle(request).pipe(
      tap({
        next: () => null,
        error: (err: unknown) => {
          const url = new URL(request.url);
          const status = (err as HttpErrorResponse).status;
          let error = `Request to "${url.pathname}" failed. Check the console for the details`;

          if (status === 401) {
            error = `Unauthorized to execute the request ${url.pathname}`;
          } else if (status === 403) {
            error = `User doesn't have permission execute the request ${url.pathname}`;
          }

          this.notificationService.showError(
            error,
            0
          );

          throwError(err);
        },
      })
    );
  }
}
