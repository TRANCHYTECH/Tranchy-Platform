import { Component, OnInit, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { SharedModule } from '@tranchy/shared';

@Component({
  selector: 'tranchy-app-topbar',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent implements OnInit {

  element: any;
  mode: string | undefined;
  @Output() mobileMenuButtonClicked = new EventEmitter();

  flagvalue: any;
  valueset: any;
  countryName: any;
  cookieValue: any;
  userData: any;
  total = 0;
  cart_length: any = 0;

  ngOnInit(): void {
    this.element = document.documentElement;

    // Cookies wise Language set
    const val = this.listLang.filter(x => x.lang === this.cookieValue);
    this.countryName = val.map(element => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) { this.valueset = 'assets/images/flags/us.svg'; }
    } else {
      this.flagvalue = val.map(element => element.flag);
    }
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    // document.querySelector('.hamburger-icon')?.classList.toggle('open')
    // event.preventDefault();
    // this.mobileMenuButtonClicked.emit();
    // if (document.documentElement.clientWidth <= 1024) {
    //   if (document.documentElement.getAttribute('data-layout') == 'vertical') {
    //     (document.documentElement.getAttribute('data-sidebar-size') == "sm") ? document.documentElement.setAttribute('data-sidebar-size', 'lg') : document.documentElement.setAttribute('data-sidebar-size', 'sm')
    //   }
    //   if (document.documentElement.getAttribute('data-layout') == 'horizontal')
    //     document.body.classList.toggle('menu');
    // }
    // if (document.documentElement.clientWidth <= 767) {
    //   document.body.classList.toggle('vertical-sidebar-enable');
    //   document.documentElement.setAttribute('data-sidebar-size', 'lg')
    // }
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    // document.body.classList.toggle('fullscreen-enable');
    // if (
    //   !document.fullscreenElement && !this.element.mozFullScreenElement &&
    //   !this.element.webkitFullscreenElement) {
    //   if (this.element.requestFullscreen) {
    //     this.element.requestFullscreen();
    //   } else if (this.element.mozRequestFullScreen) {
    //     /* Firefox */
    //     this.element.mozRequestFullScreen();
    //   } else if (this.element.webkitRequestFullscreen) {
    //     /* Chrome, Safari and Opera */
    //     this.element.webkitRequestFullscreen();
    //   } else if (this.element.msRequestFullscreen) {
    //     /* IE/Edge */
    //     this.element.msRequestFullscreen();
    //   }
    // } else {
    //   if (this.document.exitFullscreen) {
    //     this.document.exitFullscreen();
    //   } else if (this.document.mozCancelFullScreen) {
    //     /* Firefox */
    //     this.document.mozCancelFullScreen();
    //   } else if (this.document.webkitExitFullscreen) {
    //     /* Chrome, Safari and Opera */
    //     this.document.webkitExitFullscreen();
    //   } else if (this.document.msExitFullscreen) {
    //     /* IE/Edge */
    //     this.document.msExitFullscreen();
    //   }
    // }
  }

  /**
  * Topbar Light-Dark Mode Change
  */
  changeMode(mode: string) {
    // this.mode = mode;
    // this.eventService.broadcast('changeMode', mode);

    // switch (mode) {
    //   case 'light':
    //     document.documentElement.setAttribute('data-bs-theme', "light");
    //     document.documentElement.setAttribute('data-sidebar', "light");
    //     break;
    //   case 'dark':
    //     document.documentElement.setAttribute('data-bs-theme', "dark");
    //     document.documentElement.setAttribute('data-sidebar', "dark");
    //     break;
    //   default:
    //     document.documentElement.setAttribute('data-bs-theme', "light");
    //     break;
    // }
  }

  /***
   * Language Listing
   */
  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.svg', lang: 'en' },
    { text: 'Española', flag: 'assets/images/flags/spain.svg', lang: 'es' },
    { text: 'Deutsche', flag: 'assets/images/flags/germany.svg', lang: 'de' },
    { text: 'Italiana', flag: 'assets/images/flags/italy.svg', lang: 'it' },
    { text: 'русский', flag: 'assets/images/flags/russia.svg', lang: 'ru' },
    { text: '中国人', flag: 'assets/images/flags/china.svg', lang: 'ch' },
    { text: 'français', flag: 'assets/images/flags/french.svg', lang: 'fr' },
    { text: 'Arabic', flag: 'assets/images/flags/ae.svg', lang: 'ar' },
  ];

  /***
   * Language Value Set
   */
  setLanguage(text: string, lang: string, flag: string) {
    // this.countryName = text;
    // this.flagvalue = flag;
    // this.cookieValue = lang;
    // this.languageService.setLanguage(lang);
  }

  /**
   * Logout the user
   */
  logout() {
    // if (environment.defaultauth === 'firebase') {
    //   this.authService.logout();
    // } else {
    //   this.authFackservice.logout();
    // }
    // this.authService.logout();
    // this.router.navigate(['/auth/login']);
  }

  windowScroll() {
    // if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    //   (document.getElementById("back-to-top") as HTMLElement).style.display = "block";
    //   document.getElementById('page-topbar')?.classList.add('topbar-shadow')
    // } else {
    //   (document.getElementById("back-to-top") as HTMLElement).style.display = "none";
    //   document.getElementById('page-topbar')?.classList.remove('topbar-shadow')
    // }
  }

  // Delete Item
  deleteItem(event: any, id: any) {
    // var price = event.target.closest('.dropdown-item').querySelector('.item_price').innerHTML;
    // var Total_price = this.total - price;
    // this.total = Total_price;
    // this.cart_length = this.cart_length - 1;
    // this.total > 1 ? (document.getElementById("empty-cart") as HTMLElement).style.display = "none" : (document.getElementById("empty-cart") as HTMLElement).style.display = "block";
    // document.getElementById('item_' + id)?.remove();
  }

  // Search Topbar
  Search() {
    // var searchOptions = document.getElementById("search-close-options") as HTMLAreaElement;
    // var dropdown = document.getElementById("search-dropdown") as HTMLAreaElement;
    // var input: any, filter: any, ul: any, li: any, a: any | undefined, i: any, txtValue: any;
    // input = document.getElementById("search-options") as HTMLAreaElement;
    // filter = input.value.toUpperCase();
    // var inputLength = filter.length;

    // if (inputLength > 0) {
    //   dropdown.classList.add("show");
    //   searchOptions.classList.remove("d-none");
    //   var inputVal = input.value.toUpperCase();
    //   var notifyItem = document.getElementsByClassName("notify-item");

    //   Array.from(notifyItem).forEach(function (element: any) {
    //     var notifiTxt = ''
    //     if (element.querySelector("h6")) {
    //       var spantext = element.getElementsByTagName("span")[0].innerText.toLowerCase()
    //       var name = element.querySelector("h6").innerText.toLowerCase()
    //       if (name.includes(inputVal)) {
    //         notifiTxt = name
    //       } else {
    //         notifiTxt = spantext
    //       }
    //     } else if (element.getElementsByTagName("span")) {
    //       notifiTxt = element.getElementsByTagName("span")[0].innerText.toLowerCase()
    //     }
    //     if (notifiTxt)
    //       element.style.display = notifiTxt.includes(inputVal) ? "block" : "none";

    //   });
    // } else {
    //   dropdown.classList.remove("show");
    //   searchOptions.classList.add("d-none");
    // }
  }

  /**
   * Search Close Btn
   */
  closeBtn() {
    // var searchOptions = document.getElementById("search-close-options") as HTMLAreaElement;
    // var dropdown = document.getElementById("search-dropdown") as HTMLAreaElement;
    // var searchInputReponsive = document.getElementById("search-options") as HTMLInputElement;
    // dropdown.classList.remove("show");
    // searchOptions.classList.add("d-none");
    // searchInputReponsive.value = "";
  }

}
