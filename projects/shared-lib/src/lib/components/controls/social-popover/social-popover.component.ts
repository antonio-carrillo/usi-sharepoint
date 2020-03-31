import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'shared-social-popover',
  templateUrl: './social-popover.component.html',
  styleUrls: ['./social-popover.component.css']
})
export class SocialPopoverComponent implements OnInit {
  // HACK:
  @Input() mensajeAsunto: string;
  @Input() mensajeContenido: string;
  @Input() url: string;
  @Input() twitterText: string;

  constructor() { }

  ngOnInit() {
  }

}
