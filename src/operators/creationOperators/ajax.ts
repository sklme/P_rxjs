// ajax

import { catchError, map, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';

// only work in browser
(() => {
  ajax(`https://api.github.com/users?per_page=5`)
    .pipe(
      map((r) => console.log('users,', r)),
      catchError((err) => {
        console.log('error:', err);
        return of(err);
      }),
    )
    .subscribe((n) => {
      console.log(n);
    });
})();
