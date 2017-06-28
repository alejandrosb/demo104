import { Component , ViewChild, ElementRef} from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase  } from 'angularfire2/database';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Platform } from 'ionic-angular';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  tasks: FirebaseListObservable<any>;
  lat:any = 0.0;
  lon:any = 0.0;
  items: FirebaseListObservable<any[]>;
  @ViewChild('mapContainer') mapContainer: ElementRef;
  map: any;


  constructor(
    private diagnostic: Diagnostic,
    public platform: Platform,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public database: AngularFireDatabase,
    public geolocation: Geolocation,
    public http: Http
  ) {
    this.tasks = this.database.list('/Registros');
  }

  ionViewWillEnter() {
    this.displayGoogleMap();
    this.addMarkersToMap();
    this.checkLocation();
  }
  checkGeo(){
    this.geolocation.getCurrentPosition().then((resp) => {
// resp.coords.latitude
// resp.coords.longitude
    this.lat = resp.coords.latitude;
    this.lon = resp.coords.longitude;

}).catch((error) => {
console.log('Error getting location', error);

});

  }
  displayGoogleMap() {
      let latLng = new google.maps.LatLng(-25.28443775, -57.75512695);

      let mapOptions = {
        center: latLng,
        zoom:6,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
    }

    addMarkersToMap() {

      var position;
      var myMarker;
      this.items = this.database.list('/Registros',{preserveSnapshot:true});
      this.items.subscribe(snapshots => {
          snapshots.forEach(snapshot => {

              position = new google.maps.LatLng(snapshot.val().lat, snapshot.val().long);
              myMarker = new google.maps.Marker({position: position, title: snapshot.val().zona});
              myMarker.setMap(this.map);

              });

            });

          }


    createTask(){
      this.checkGeo();
      this.platform.ready().then((readySource) => {
      this.diagnostic.isLocationEnabled().then(
      (isAvailable) => {

        if (isAvailable === false) {
        //alert('Is available ');
        let alert = this.alertCtrl.create({
          title: 'Habilitar GPS',
          subTitle: 'El proveedor de GPS está desactivado. Por favor, actívelo',
          buttons: ['Aceptar']
        });

        alert.present();
        return;
        }

        let newTaskModal = this.alertCtrl.create({
          title: 'Nuevo Registro',
          message: "Ingresar Nuevo Registro",
          inputs: [
            {
              name: 'title',
              placeholder: 'Nombre y Apellido'
            },
            {
              name: 'ci',
              placeholder: 'Cedula de Identidad'
            },
            {
              name: 'zona',
              placeholder: 'Zona'
            },
          ],
          buttons: [
            {
              text: 'Cancel',
              handler: data => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Save',
              handler: data => {
                this.tasks.push({
                  nombreapellido: data.title,
                  ci: data.ci,
                  zona: data.zona,
                  lat: this.lat,
                  long: this.lon
                });
              }
            }
          ]
        });
        newTaskModal.present( newTaskModal );
      }).catch( (e) => {
      console.log(e);
      alert(JSON.stringify(e));
      });

      });

  }



  removeTask( task ){
    this.tasks.remove( task.$key );
  }

  checkLocation()
    {
    this.platform.ready().then((readySource) => {

    this.diagnostic.isLocationEnabled().then(
    (isAvailable) => {

      if (isAvailable === false) {
      let alert = this.alertCtrl.create({
        title: 'Habilitar GPS',
        subTitle: 'El proveedor de GPS está desactivado. Por favor, actívelo',
        buttons: ['Aceptar']
      });

      alert.present();
      return;
      }
    }).catch( (e) => {
    console.log(e);
    alert(JSON.stringify(e));
    });

    });
    }





}
