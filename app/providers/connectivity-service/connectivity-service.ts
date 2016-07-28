import {Injectable} from '@angular/core';
import {Network, Connection} from 'ionic-native';
import {Platform} from 'ionic-angular';

@Injectable()
export class ConnectivityService {

  onDevice: boolean;

  constructor(private platform: Platform){
    this.onDevice = this.platform.is('ios') || this.platform.is('android');
  }

  isOnline() {
    if(this.onDevice && Network.connection){
      return Network.connection !== Connection.NONE;
    } else {
      return navigator.onLine;      
    }
  }

  isOffline(){
    if(this.onDevice && Network.connection){
      return Network.connection === Connection.NONE;
    } else {
      return !navigator.onLine;     
    }
  }
}