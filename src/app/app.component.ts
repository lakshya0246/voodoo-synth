import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.showKeymap = true;
    }, 200);
  }
  title = 'js-synth-test';
  showTroubleshooting = false;
  showKeymap = false;

  @HostListener('document:keyup', ['$event'])
  onKeyup(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this.showKeymap = false;
      this.showTroubleshooting = false;
    }
  }
}
