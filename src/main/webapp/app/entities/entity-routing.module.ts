import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'payment-option',
        data: { pageTitle: 'evergentApp.paymentOption.home.title' },
        loadChildren: () => import('./payment-option/payment-option.module').then(m => m.PaymentOptionModule),
      },
      {
        path: 'shareholder',
        data: { pageTitle: 'evergentApp.shareholder.home.title' },
        loadChildren: () => import('./shareholder/shareholder.module').then(m => m.ShareholderModule),
      },
      {
        path: 'dividend-shareholder',
        data: { pageTitle: 'evergentApp.dividendShareholder.home.title' },
        loadChildren: () => import('./dividend-shareholder/dividend-shareholder.module').then(m => m.DividendShareholderModule),
      },
      {
        path: 'dividend-calculation',
        data: { pageTitle: 'evergentApp.dividendCalculation.home.title' },
        loadChildren: () => import('./dividend-calculation/dividend-calculation.module').then(m => m.DividendCalculationModule),
      },
      {
        path: 'dividend-register',
        data: { pageTitle: 'evergentApp.dividendRegister.home.title' },
        loadChildren: () => import('./dividend-register/dividend-register.module').then(m => m.DividendRegisterModule),
      },
      {
        path: 'legal-hold',
        data: { pageTitle: 'evergentApp.legalHold.home.title' },
        loadChildren: () => import('./legal-hold/legal-hold.module').then(m => m.LegalHoldModule),
      },
      {
        path: 'payment',
        data: { pageTitle: 'evergentApp.payment.home.title' },
        loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule),
      },
      {
        path: 'communication',
        data: { pageTitle: 'evergentApp.communication.home.title' },
        loadChildren: () => import('./communication/communication.module').then(m => m.CommunicationModule),
      },
      {
        path: 'sys-parameter',
        data: { pageTitle: 'evergentApp.sysParameter.home.title' },
        loadChildren: () => import('./sys-parameter/sys-parameter.module').then(m => m.SysParameterModule),
      },
      {
        path: 'vote-entry',
        data: { pageTitle: 'evergentApp.voteEntry.home.title' },
        loadChildren: () => import('./vote-entry/vote-entry.module').then(m => m.VoteEntryModule),
      },
      {
        path: 'vote-proposal',
        data: { pageTitle: 'evergentApp.voteProposal.home.title' },
        loadChildren: () => import('./vote-proposal/vote-proposal.module').then(m => m.VoteProposalModule),
      },
      {
        path: 'vote-option',
        data: { pageTitle: 'evergentApp.voteOption.home.title' },
        loadChildren: () => import('./vote-option/vote-option.module').then(m => m.VoteOptionModule),
      },
      {
        path: 'group',
        data: { pageTitle: 'evergentApp.group.home.title' },
        loadChildren: () => import('./group/group.module').then(m => m.GroupModule),
      },
      {
        path: 'inheritance',
        data: { pageTitle: 'evergentApp.inheritance.home.title' },
        loadChildren: () => import('./inheritance/inheritance.module').then(m => m.InheritanceModule),
      },
      {
        path: 'shareholder-x-inheritance',
        data: { pageTitle: 'evergentApp.shareholderXInheritance.home.title' },
        loadChildren: () =>
          import('./shareholder-x-inheritance/shareholder-x-inheritance.module').then(m => m.ShareholderXInheritanceModule),
      },
      {
        path: 'shareholder-x-group',
        data: { pageTitle: 'evergentApp.shareholderXGroup.home.title' },
        loadChildren: () => import('./shareholder-x-group/shareholder-x-group.module').then(m => m.ShareholderXGroupModule),
      },
      {
        path: 'vote-entry-x-vote-option',
        data: { pageTitle: 'evergentApp.voteEntryXVoteOption.home.title' },
        loadChildren: () => import('./vote-entry-x-vote-option/vote-entry-x-vote-option.module').then(m => m.VoteEntryXVoteOptionModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
