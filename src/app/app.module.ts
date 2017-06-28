import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

export const firebaseConfig = {
apiKey: "AIzaSyCuQbRC3V2RF8WTJ0oG83qlZz89yQARqHQ",
  authDomain: "geoloc-24b81.firebaseapp.com",
  databaseURL: "https://geoloc-24b81.firebaseio.com",
  projectId: "geoloc-24b81",
  storageBucket: "geoloc-24b81.appspot.com",
  messagingSenderId: "600758599567"
};


@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
  BrowserModule,
  HttpModule,
  IonicModule.forRoot(MyApp),
  AngularFireModule.initializeApp(firebaseConfig,'demo104'),
  AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Diagnostic,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation
  ]
})
export class AppModule {}
