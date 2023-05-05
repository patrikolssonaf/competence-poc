import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';

import { OccupationGroupPickerComponent } from './occupation-group-picker/occupation-group-picker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { OntologyPickerComponent } from './ontology-picker/ontology-picker.component';
import { JobAdEnrichmentComponent } from './job-ad-enrichment/job-ad-enrichment.component';
import { OntologyComponent } from './ontology/ontology.component';
import { OntologySkillPickerComponent } from './ontology-skill-picker/ontology-skill-picker.component';
import { PocComponent } from './poc/poc.component';
import { MappingComponent } from './mapping/mapping.component';
import { TaxonomyPOCComponent } from './taxonomy-poc/taxonomy-poc.component';

@NgModule({
  declarations: [
    AppComponent,
    OccupationGroupPickerComponent,
    OntologyPickerComponent,
    JobAdEnrichmentComponent,
    OntologyComponent,
    OntologySkillPickerComponent,
    PocComponent,
    MappingComponent,
    TaxonomyPOCComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatDividerModule,
    MatTabsModule,
    MatButtonModule,
    MatExpansionModule,
    MatGridListModule,
    MatCardModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
