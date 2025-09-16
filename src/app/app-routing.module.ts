import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'pan-entry', loadChildren: () => import('./features/kyc-auth/pan-entry/pan-entry.module').then(m => m.PanEntryPageModule) },
  { path: 'otp-verify', loadChildren: () => import('./features/kyc-auth/otp-verify/otp-verify.module').then(m => m.OtpVerifyPageModule) },
  { path: 'create-mpin', loadChildren: () => import('./features/kyc-auth/create-mpin/create-mpin.module').then(m => m.CreateMpinPageModule) },
  { path: 'generate-mpin', loadChildren: () => import('./features/kyc-auth/generate-mpin/generate-mpin.module').then(m => m.GenerateMpinPageModule) },
  { path: '', redirectTo: 'pan-entry', pathMatch: 'full' },
  {
    path: 'pan-number-double-flat-model',
    loadChildren: () => import('./features/kyc-auth/pan-number-double-flat-model/pan-number-double-flat-model.module').then(m => m.PanNumberDoubleFlatModelPageModule)
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./features/kyc-auth/privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardPageModule)
  },
  {
    path: 'generate-model',
    loadChildren: () => import('./features/kyc-auth/generate-model/generate-model.module').then(m => m.GenerateModelPageModule)
  },
  {
    path: 'mpin-policies',
    loadChildren: () => import('./features/kyc-auth/mpin-policies/mpin-policies.module').then(m => m.MpinPoliciesPageModule)
  },
  {
    path: 'UploadimagesPage',
    loadChildren: () => import('./uploaddocuments/uploadimage/uploadimage.module').then(m => m.UploadimagePageModule)
  },
  {
    path: 'FinancialsPage',
    loadChildren: () => import('./Financials/financials/financials.module').then(m => m.FinancialsPageModule)
  },
  {
    path: 'CustomerCarePage',
    loadChildren: () => import('./Tickets/tickets/tickets.module').then(m => m.TicketsPageModule)
  },
  {
    path: 'ComplaintsPage',
    loadChildren: () => import('./Complaints/complaints/complaints.module').then(m => m.ComplaintsPageModule)
  },
  {
    path: 'BookAppointmentPage',
    loadChildren: () => import('./Appointment/book/book.module').then(m => m.BookPageModule)
  },

  {
    path: 'PaintsPage',
    loadChildren: () => import('./Selections/selections/selections.module').then(m => m.SelectionsPageModule)
  },
  {
    path: 'ReferencetabsPage',
    loadChildren: () => import('./References/references/references.module').then(m => m.ReferencesPageModule)
  },
  {
    path: 'NotificationsPage',
    loadChildren: () => import('./project/project.module').then(m => m.ProjectPageModule)
  },
  {
    path: 'CompanyupdatesPage',
    loadChildren: () => import('./company/company.module').then(m => m.CompanyPageModule)
  },
  {
    path: 'PropertyPage',
    loadChildren: () => import('./unit/unit.module').then(m => m.UnitPageModule)
  },
  {
    path: 'HomePage',
    loadChildren: () => import('./Insight/insight/insight.module').then(m => m.InsightPageModule)
  },
  {
    path: 'ChangepasswordPage',
    loadChildren: () => import('./change/change.module').then(m => m.ChangePageModule)
  },
  {
    path: 'CustomerprofilePage',
    loadChildren: () => import('./Profile/profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'FaqPage',
    loadChildren: () => import('./FAQ/faq/faq.module').then(m => m.FaqPageModule)
  },
  {
    path: 'MprPage',
    loadChildren: () => import('./MPR/mpr/mpr.module').then(m => m.MprPageModule)
  },
  {
    path: 'demand',
    loadChildren: () => import('./Financials/demand/demand.module').then( m => m.DemandPageModule)
  },
  {
    path: 'intrest',
    loadChildren: () => import('./Financials/intrest/intrest.module').then( m => m.IntrestPageModule)
  },
  {
    path: 'receipt',
    loadChildren: () => import('./Financials/receipt/receipt.module').then( m => m.ReceiptPageModule)
  },
  {
    path: 'invoices',
    loadChildren: () => import('./Financials/invoices/invoices.module').then( m => m.InvoicesPageModule)
  },
  {
    path: 'upload-image-view',
    loadChildren: () => import('./uploaddocuments/upload-image-view/upload-image-view.module').then( m => m.UploadImageViewPageModule)
  },

  {
    path: 'EcomunicationMessagesPage',
    loadChildren: () => import('./inbox/message-list/message-list.module').then( m => m.MessageListPageModule)
  },
  {
    path: 'message-chat',
    loadChildren: () => import('./inbox/message-chat/message-chat.module').then( m => m.MessageChatPageModule)
  },


 
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
