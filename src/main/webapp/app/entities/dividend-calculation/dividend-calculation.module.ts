import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DividendCalculationComponent } from './list/dividend-calculation.component';
import { DividendCalculationDetailComponent } from './detail/dividend-calculation-detail.component';
import { DividendCalculationUpdateComponent } from './update/dividend-calculation-update.component';
import { DividendCalculationDeleteDialogComponent } from './delete/dividend-calculation-delete-dialog.component';
import { DividendCalculationRoutingModule } from './route/dividend-calculation-routing.module';

@NgModule({
  imports: [SharedModule, DividendCalculationRoutingModule],
  declarations: [
    DividendCalculationComponent,
    DividendCalculationDetailComponent,
    DividendCalculationUpdateComponent,
    DividendCalculationDeleteDialogComponent,
  ],
})
export class DividendCalculationModule {}
