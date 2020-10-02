//import { OnInit, Input } from '@angular/core';

export interface ActionComponentInterface {
  action: {};
  
  execute(): void; // Begin processing the action. Returns action object for History

}
