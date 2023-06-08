import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SysParameterComponent } from './list/sys-parameter.component';
import { SysParameterDetailComponent } from './detail/sys-parameter-detail.component';
import { SysParameterUpdateComponent } from './update/sys-parameter-update.component';
import { SysParameterDeleteDialogComponent } from './delete/sys-parameter-delete-dialog.component';
import { SysParameterRoutingModule } from './route/sys-parameter-routing.module';

@NgModule({
  imports: [SharedModule, SysParameterRoutingModule],
  declarations: [SysParameterComponent, SysParameterDetailComponent, SysParameterUpdateComponent, SysParameterDeleteDialogComponent],
})
export class SysParameterModule {}
