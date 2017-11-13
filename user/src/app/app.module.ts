import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { RouterModule, Router, Routes } from '@angular/router';
// import { HashLocationStrategy, LocationStrategy } from '@angular/common';
// import { GoogleMapDirective } from '../app/directives/google-map.directive';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SettingsComponent } from './settings/settings.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { WindowRef } from './checkout/WindowRef';
import { MenuComponent } from './menu/menu.component';
import { OrdersComponent } from './orders/orders.component';
import { ProfileComponent } from './profile/profile.component';
import { RewardPointsComponent } from './reward-points/reward-points.component';
import { RewardsComponent } from './rewards/rewards.component';
import { AboutComponent } from './about/about.component';
import { TermsComponent } from './terms/terms.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { ContactComponent } from './contact/contact.component';
import { AddressComponent } from './address/address.component';

// Admin components
import { AdminComponent } from './admin/admin/admin.component';
import { AddAdminComponent } from './admin/add-admin/add-admin.component';
import { AddCategoryComponent } from './admin/add-category/add-category.component';
import { AddItemsComponent } from './admin/add-items/add-items.component';
import { AddSubsComponent } from './admin/add-subs/add-subs.component';
import { LoginComponent } from './admin/login/login.component';
import { AddMenuComponent } from './admin/add-menu/add-menu.component';
import { ReportsComponent } from './admin/reports/reports.component';
import { AddRewardsComponent } from './admin/add-rewards/add-rewards.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { ThanksComponent } from './thanks/thanks.component';
import { SoldoutComponent } from './admin/soldout/soldout.component';
import { MyDatePickerModule } from 'mydatepicker';
// import { DaterangePickerModule } from 'ng2-daterange-picker';
// import { AdminComponent } from "./admin/admin.component";


// Services
import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { AdminAuthService } from './services/admin-auth.service';
import { GetMenuService } from './services/get-menu.service';
import { UserService } from './services/user-service.service';
import { AdminServicesService } from './services/admin-services.service';
import { DatePipe } from '@angular/common';
import { FlashMessagesModule } from 'angular2-flash-messages';
// Auth Guard
import { AuthGuard } from './guards/auth.guard';
import { AdminAuthGuard } from './guards/admin-auth.guard';


const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'menu',
        component: MenuComponent,
    },
    {
        path: 'rewards',
        component: RewardsComponent
    },
    {
        path: 'contact',
        component: ContactComponent
    },
    {
        path: 'terms',
        component: TermsComponent
    },
    {
        path: 'privacy',
        component: PrivacyComponent
    },
    {
        path: 'about',
        component: AboutComponent
    },
    {
        path: 'checkout',
        component: CheckoutComponent,
        // canActivate: [AuthGuard]
    },
    {
        path: 'thanks',
        component: ThanksComponent,
        // canActivate: [AuthGuard]
    },
    {
        path: 'settings',
        component: SettingsComponent,
        //canActivate: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: 'profile',
                pathMatch: 'full',
            },
            {
                path: 'address',
                component: AddressComponent,
            },
            {
                path: 'my-orders',
                component: OrdersComponent,
            },
            {
                path: 'profile',
                component: ProfileComponent,
            },
            {
                path: 'change-password',
                component: ChangePasswordComponent,
            },
            {
                path: 'reward-points',
                component: RewardPointsComponent,
            },

        ]
    },
    {
        path: 'admin',
        component: AdminComponent,
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full',
            },
            {
                path: 'orders',
                component: AdminOrdersComponent,
                //canActivate: [AdminAuthGuard]
            },
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'add-admin',
                component: AddAdminComponent,
                //canActivate: [AdminAuthGuard]
            },
            {
                path: 'reports',
                component: ReportsComponent,
                data: { title: 'Report' },
                //canActivate: [AdminAuthGuard]
            },
            {
                path: 'add-menu',
                component: AddMenuComponent,
                data: { title: 'Menu' },
                //canActivate: [AdminAuthGuard]
            },
            {
                path: 'add-rewards',
                component: AddRewardsComponent,
                data: { title: 'Reward Points' },
                //canActivate: [AdminAuthGuard]
            },
            {
                path: 'add-items',
                component: AddItemsComponent,
                data: { title: 'Add Items' },
                //canActivate: [AdminAuthGuard]
            },
            {
                path: 'settings',
                component: SettingsComponent,
                data: { title: 'Settings' },
                //canActivate: [AdminAuthGuard]
            },
            {
                path: 'soldout',
                component: SoldoutComponent,
                data: { title: 'Soldout' },
                //canActivate: [AdminAuthGuard]
            },
            {
                path: 'add-category',
                component: AddCategoryComponent,
                data: { title: 'Add Category' },
                //canActivate: [AdminAuthGuard]
            },
            {
                path: 'add-sub-category',
                component: AddSubsComponent,
                data: { title: 'Add Sub Category' },
                //canActivate: [AdminAuthGuard]
            },
        ]
    }

];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChangePasswordComponent,
    SettingsComponent,
    CheckoutComponent,
    MenuComponent,
    OrdersComponent,
    ProfileComponent,
    RewardPointsComponent,
    RewardsComponent,
    AboutComponent,
    TermsComponent,
    PrivacyComponent,
    ContactComponent,
    AddressComponent,
    AdminComponent,
    AddAdminComponent,
    AddCategoryComponent,
    AddItemsComponent,
    AddSubsComponent,
    LoginComponent,
    AddMenuComponent,
    ReportsComponent,
    AddRewardsComponent,
    AdminOrdersComponent,
    ThanksComponent,
    SoldoutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule,
    MyDatePickerModule
  ],
  // tslint:disable-next-line:max-line-length
  providers: [ValidateService, AuthService, AdminAuthService, AuthGuard, AdminAuthGuard, GetMenuService, DatePipe, UserService, AdminServicesService, WindowRef],
  bootstrap: [AppComponent]
})
export class AppModule { }
