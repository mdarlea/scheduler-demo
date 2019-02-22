import {Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs';

@Injectable()
export class LoaderService {
    private loadingSource = new Subject<boolean>();
    loading$ = this.loadingSource.asObservable();

    load(loading: boolean) {
      this.loadingSource.next(loading);
    }
}
