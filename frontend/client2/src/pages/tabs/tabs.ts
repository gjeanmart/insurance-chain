import { Component } from '@angular/core';

import { NewPolicyPage } from '../new_policy/new_policy';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = NewPolicyPage;
  tab3Root = ContactPage;

  constructor() {

  }
}
