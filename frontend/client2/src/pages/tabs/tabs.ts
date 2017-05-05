import { Component }        from '@angular/core';

import { NewPolicyPage }    from '../new_policy/new_policy';
import { HistoryPage }      from '../history/history';
import { HomePage }         from '../home/home';
import { SettingsPage }     from '../settings/settings';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = NewPolicyPage;
  tab3Root = HistoryPage;
  tab4Root = SettingsPage;

  constructor() {

  }
}
