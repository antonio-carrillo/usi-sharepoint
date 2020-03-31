import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'sb-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit {
  searchForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.setupForm();
  }

  // Custom public methods

  onSubmit() {
    window.location.href = `${environment.redirectUrl}/${this.searchForm.value.search}`;
  }

  // Custom private methods

  private setupForm() {
    this.searchForm = this.fb.group({
      search: null
    });
  }

  // Getters and setters

  get search() {
    return this.searchForm.get('search');
  }

}
