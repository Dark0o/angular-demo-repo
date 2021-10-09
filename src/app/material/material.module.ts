import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

const MaterialComponents = [MatTableModule];
@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents],
})
export class MaterialModule {}
