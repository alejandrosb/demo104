import { Component , ViewChild, ElementRef} from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase  } from 'angularfire2/database';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

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
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public database: AngularFireDatabase,
    public geolocation: Geolocation,
    public http: Http
  ) {
        this.geolocation.getCurrentPosition().then((resp) => {
    // resp.coords.latitude
    // resp.coords.longitude
        this.lat = resp.coords.latitude;
        this.lon = resp.coords.longitude;

    }).catch((error) => {
    console.log('Error getting location', error);
    });

    this.tasks = this.database.list('/Registros');

  }


  ionViewWillEnter() {
    this.displayGoogleMap();
    this.addMarkersToMap();
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
  }



  removeTask( task ){
    this.tasks.remove( task.$key );
  }
}
