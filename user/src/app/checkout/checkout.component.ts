import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppComponent } from '../app.component';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AdminServicesService } from '../services/admin-services.service';
import { DatePipe } from '@angular/common';
import * as shortid from 'shortid';
import * as moment from 'moment';
import { WindowRef } from './WindowRef';

declare var $: any;

// var shortid = require('shortid');

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css', '../menu/menu.component.css']
})
export class CheckoutComponent implements OnInit {

  // tslint:disable-next-line:max-line-length
  constructor(private authService: AuthService, private title: Title, private router: Router, private getMenu: AdminServicesService, private datePipe: DatePipe, private winRef: WindowRef) {}
  // Razorpay variables
  rzp1: any;
  options: any;

  addresses= [];
  userId: string;
  userEmail: string;
  fullName: string;
  userName: string;
  companyName: string;
  userMobile: number;
  orders: object;
  today_orders: object;

  today_date: string = null;
  day_one_date: string = null;
  day_two_date: string = null;
  day_three_date: string = null;
  day_four_date: string = null;
  day_five_date: string = null;
  day_six_date: string = null;

  today_per_portion_price: number;
  day_one_per_portion_price: number;
  day_two_per_portion_price: number;
  day_three_per_portion_price: number;
  day_four_per_portion_price: number;
  day_five_per_portion_price: number;
  day_six_per_portion_price: number;

  today_num_items: number;
  day_one_num_items: number;
  day_two_num_items: number;
  day_three_num_items: number;
  day_four_num_items: number;
  day_five_num_items: number;
  day_six_num_items: number;

  today_total_price = 0;
  day_one_total_price = 0;
  day_two_total_price = 0;
  day_three_total_price = 0;
  day_four_total_price = 0;
  day_five_total_price = 0;
  day_six_total_price = 0;

  today_menu = [];
  day_one_menu = [];
  day_two_menu = [];
  day_three_menu = [];
  day_four_menu = [];
  day_five_menu = [];
  day_six_menu = [];

  today_slot: string;
  day_one_slot: string;
  day_two_slot: string;
  day_three_slot: string;
  day_four_slot: string;
  day_five_slot: string;
  day_six_slot: string;

  slot_one = '12:00 - 12:45';
  slot_two = '12:45 - 1:30';
  slot_three = '1:30 - 2:15';
  slot_four = '2:15 - 3';

  delivery_fee = 0;
  total_price: number;
  total_to_pay: number;

  tab_one: object;
  tab_two: object;
  tab_three: object;

  // Tabs names
  tab_one_name: string;
  tab_two_name: string;
  tab_three_name: string;

  // Tabs time slots
  tab_one_time_slot: string;
  tab_two_time_slot: string;
  tab_three_time_slot: string;

  // Tabs base price
  tab_one_base_price: number;
  tab_two_base_price: number;
  tab_three_base_price: number;
  // Tabs total price
  tab_one_total_price = 0;
  tab_two_total_price = 0;
  tab_three_total_price = 0;

  // Tab num of times
  tab_one_times: number;
  tab_two_times: number;
  tab_three_times: number;


  selected_address: string;
  payment_method: string;
  deliveryInst = '';
  rewardPoints: number;

  basket_num: number;

  rewardPointsPermissions = false;
  redeemable = 0;
  discount = 0;
  deduct_points = 0;
  remainingPoints = 0;

  points_earned = 0;

  today_one = moment();
  dateForHeader: string;
  original_address: string;
  placeholder_address: string;
  letter_price = 0;
  letter_added = 'false';
  one_address= false;
  showDiscount = false;

  tab_one_change_status = false;
  tab_two_change_status = false;
  tab_three_change_status = false;
  day_one_change_status = false;
  day_two_change_status = false;
  day_three_change_status = false;
  day_four_change_status = false;
  day_five_change_status = false;

  schSlot: any;
  schTimes: any;

  ngOnInit() {
    // Getting orders
    this.title.setTitle('Fysu - Checkout');



    this.dateForHeader = this.datePipe.transform(this.today_one, 'EEE, MMM d');

    // Get basketnumber from localstorage
    // tslint:disable-next-line:radix
    this.basket_num = parseInt(localStorage.getItem('basket_number'));
    if (this.basket_num === undefined || this.basket_num === null || this.basket_num === 0 || isNaN(this.basket_num) === true) {
      // redirect to menu
      //this.router.navigate(['/menu']);
      // alert('no');
    }else {
      // alert('yes');
    }

    const user = this.authService.getUserFromLocal();
    const user_parsed = JSON.parse(user);
    this.userEmail = user_parsed.email;
    this.fullName = user_parsed.name;
    this.companyName = user_parsed.company_name;
    this.userMobile = user_parsed.mobile;
    this.userId = user_parsed.id;
    const fLength = this.fullName.split(' ');

    if (fLength.length > 1) {
      this.userName = this.fullName.split(' ').slice(0, -1).join(' ');
    }else {
      this.userName = this.fullName;
    }

    // Getting user reward points
    this.authService.getUserRewards(this.userId).subscribe(res => {
      if (res.success) {
        this.rewardPoints = res.msg;
        // Conditions
        if (this.rewardPoints > 100) {
          this.rewardPointsPermissions = true;
          if (this.rewardPoints < 189) {
            // Number of redeemable points are 100
            this.redeemable = 100;
            // Cost deductable
            this.discount = 10;
          }
          if (this.rewardPoints > 191 && this.rewardPoints < 259) {
            // Number of redeemable points are 190
            this.redeemable = 190;
            // Cost deductable
            this.discount = 20;
          }
          if (this.rewardPoints > 360) {
            // Number of redeemable points
          }
        }
      }else {
        this.rewardPoints = 0;
        // Can't do anything
      }
    });

    // Get if letter is added from localstorage
    this.letter_added = localStorage.getItem('letter_added');

    if (this.letter_added === 'true') {
      this.letter_price = 5;
    }else {

    }
    // Get orders from local storage
    const s_orders = localStorage.getItem('all_orders');
    this.orders = JSON.parse(s_orders);

    const to_orders = localStorage.getItem('today_orders');
    this.today_orders = JSON.parse(to_orders);
    if (this.today_orders != null) {
      // console.log(this.today_orders);
      // tab one
      this.tab_one = this.today_orders['tab_one'];
      this.tab_two = this.today_orders['tab_two'];
      this.tab_three = this.today_orders['tab_three'];

      if (this.tab_one != null) {
        this.tab_one_base_price = this.today_orders['tab_one'].base_price;
        this.tab_one_total_price = this.today_orders['tab_one'].total_price;
        this.tab_one_name = this.today_orders['tab_one'].name;
        this.tab_one_times = this.today_orders['tab_one'].num_of_items;
        this.tab_one_time_slot = this.getSlotValue(this.today_orders['tab_one'].time_slot);
        // alert(this.tab_one_name);
      }


      if (this.tab_two != null) {
        this.tab_two_base_price = this.today_orders['tab_two'].base_price;
        this.tab_two_total_price = this.today_orders['tab_two'].total_price;
        this.tab_two_name = this.today_orders['tab_two'].name;
        this.tab_two_times = this.today_orders['tab_two'].num_of_items;
        this.tab_two_time_slot = this.getSlotValue(this.today_orders['tab_two'].time_slot);
      }

      if (this.tab_three != null) {
        this.tab_three_base_price = this.today_orders['tab_three'].base_price;
        this.tab_three_total_price = this.today_orders['tab_three'].total_price;
        this.tab_three_name = this.today_orders['tab_three'].name;
        this.tab_three_times = this.today_orders['tab_three'].num_of_items;
        this.tab_three_time_slot = this.getSlotValue(this.today_orders['tab_three'].time_slot);
      }

    }


    // Get addresses
    this.authService.getUserAddressses(this.userId).subscribe(res => {
      if (res.success) {
        this.addresses = res.msg[0].address;
        if (this.addresses.length === 1) {
          this.one_address = true;
          console.log('one address');
        }else {
          const addressd = {
            user_id: this.userId,
            address: localStorage.getItem('home_address')
          };
          this.authService.saveAddress(addressd).subscribe(rees => {
            if (rees.success) {
              // Address saved
              alert('saved');
            }else {
              alert('nope');
            }
          });
          this.addresses.push(localStorage.getItem('home_address'));
        }
      }
    });

    if (this.orders != null) {
      if (this.orders['day_one'] != null) {
        this.day_one_date = this.orders['day_one'].date;
        this.day_one_per_portion_price = this.orders['day_one'].perPortionPrice;
        this.day_one_total_price = this.orders['day_one'].totalPrice;
        this.day_one_num_items = this.orders['day_one'].numOfTimes;
        this.day_one_menu = this.orders['day_one'].menu;
        // Time slots
        switch (this.orders['day_one'].timeSlot) {
          case 'slot_one':
            this.day_one_slot = this.slot_one;
            break;
          case 'slot_two':
            this.day_one_slot = this.slot_two;
            break;
          case 'slot_three':
            this.day_one_slot = this.slot_three;
            break;
          default:
            break;
        }
      }else {
        this.day_one_menu = null;
      }
      if (this.orders['day_two'] != null) {
        this.day_two_date = this.orders['day_two'].date;
        this.day_two_per_portion_price = this.orders['day_two'].perPortionPrice;
        this.day_two_total_price = this.orders['day_two'].totalPrice;
        this.day_two_num_items = this.orders['day_two'].numOfTimes;
        this.day_two_menu = this.orders['day_two'].menu;

        // Time slots
        switch (this.orders['day_two'].timeSlot) {
          case 'slot_one':
            this.day_two_slot = this.slot_one;
            break;
          case 'slot_two':
            this.day_two_slot = this.slot_two;
            break;
          case 'slot_three':
            this.day_two_slot = this.slot_three;
            break;
          default:
            break;
        }

      }else {
        this.day_two_menu = null;
      }

      if (this.orders['day_three'] != null) {
        this.day_three_date = this.orders['day_three'].date;
        this.day_three_per_portion_price = this.orders['day_three'].perPortionPrice;
        this.day_three_total_price = this.orders['day_three'].totalPrice;
        this.day_three_num_items = this.orders['day_three'].numOfTimes;
        this.day_three_menu = this.orders['day_three'].menu;

        // Time slots
        switch (this.orders['day_three'].timeSlot) {
          case 'slot_one':
            this.day_three_slot = this.slot_one;
            break;
          case 'slot_two':
            this.day_three_slot = this.slot_two;
            break;
          case 'slot_three':
            this.day_three_slot = this.slot_three;
            break;
          default:
            break;
        }

      }else {
        this.day_three_menu = null;
      }

      if (this.orders['day_four'] != null) {
        this.day_four_date = this.orders['day_four'].date;
        this.day_four_per_portion_price = this.orders['day_four'].perPortionPrice;
        this.day_four_total_price = this.orders['day_four'].totalPrice;
        this.day_four_num_items = this.orders['day_four'].numOfTimes;
        this.day_four_menu = this.orders['day_four'].menu;
        // Time slots
        switch (this.orders['day_four'].timeSlot) {
          case 'slot_one':
            this.day_four_slot = this.slot_one;
            break;
          case 'slot_two':
            this.day_four_slot = this.slot_two;
            break;
          case 'slot_three':
            this.day_four_slot = this.slot_three;
            break;
          default:
            break;
        }

      }else {
        this.day_four_menu = null;
      }

      if (this.orders['day_five'] != null) {
        this.day_five_date = this.orders['day_five'].date;
        this.day_five_per_portion_price = this.orders['day_five'].perPortionPrice;
        this.day_five_total_price = this.orders['day_five'].totalPrice;
        this.day_five_num_items = this.orders['day_five'].numOfTimes;
        this.day_five_menu = this.orders['day_five'].menu;
        // Time slots
        switch (this.orders['day_five'].timeSlot) {
          case 'slot_one':
            this.day_five_slot = this.slot_one;
            break;
          case 'slot_two':
            this.day_five_slot = this.slot_two;
            break;
          case 'slot_three':
            this.day_five_slot = this.slot_three;
            break;
          default:
            break;
        }
      }else {
        this.day_five_menu = null;
      }

      if (this.orders['day_six'] != null) {
        this.day_six_date = this.orders['day_six'].date;
        this.day_six_per_portion_price = this.orders['day_six'].perPortionPrice;
        this.day_six_total_price = this.orders['day_six'].totalPrice;
        this.day_six_num_items = this.orders['day_six'].numOfTimes;
        this.day_six_menu = this.orders['day_six'].menu;
        // Time slots
        switch (this.orders['day_six'].timeSlot) {
          case 'slot_one':
            this.day_six_slot = this.slot_one;
            break;
          case 'slot_two':
            this.day_six_slot = this.slot_two;
            break;
          case 'slot_three':
            this.day_six_slot = this.slot_three;
            break;
          default:
            break;
        }
      }else {
        this.day_six_menu = null;
      }

    }
    // Get location from local storage
    // tslint:disable-next-line:max-line-length
    this.total_price = this.delivery_fee + this.today_total_price + this.day_one_total_price + this.day_two_total_price + this.day_three_total_price + this.day_four_total_price + this.day_five_total_price + this.day_six_total_price + this.tab_one_total_price + this.tab_two_total_price + this.tab_three_total_price + this.letter_price;

    this.total_to_pay = this.total_price;

    // calculate points_earned from total_price
     const rounded_num = Math.round(this.total_price / 10);
     this.points_earned = rounded_num;
    // this.points_earned


    // this.address = localStorage.getItem('home_address');
    // console.log(this.address);

  }

  // if redeem is clicked
  redeemClicked() {
    // Show discount points
    this.showDiscount = true;
    // Get total points
    // this.rewardPoints;
    // Get redeemable points;
    // this.redeemable;
    // Get discountable amount
    // this.discount;
    // Remaining user points
    this.remainingPoints = this.rewardPoints - this.redeemable;
    // Update total price
    this.total_to_pay = this.total_price - this.discount;
    // Update rewards
    this.rewardPoints = this.remainingPoints;
    // disable button
    $('#redeem-btn').css({'background-color': '#9a9a9a'});
    $('#redeem-btn').prop('disabled', true);
  }
  addRewardPoints() {
    // alert(this.points);
    this.getMenu.postRewards(this.userName, this.deduct_points).subscribe(res => {
      if (res.success) {
      }
    });
  }

  onLogoutClick() {
    this.authService.logout();
    this.router.navigate(['/home']);
    return false;
  }
  addressChecked(event) {
    this.selected_address = event.target.value;
    // alert(this.selected_address);
  }
  paymentMethod(event) {
    this.payment_method = event.target.value;
  }
  placeOrder() {
    // Check for address
    if (this.selected_address === null || this.selected_address === undefined) {
      // Show Error
      $('.err').html('Please select an address');
    }else {
      const delivery_address = this.selected_address;
      // Check for payment type
      if (this.payment_method === null || this.payment_method === undefined) {
        // Show error
        $('.err').html('Please select a payment method');
      }else {
        const pay_method = this.payment_method;
        // Generate Order Id
        // delivery notes
        let delivery_notes;
        if (this.deliveryInst != null) {
          delivery_notes = this.deliveryInst;
        }else {
          delivery_notes = '-';
        }
        // Order id
        const order_id = shortid.generate();
        // Make order
        // Cumulative of today's and all schduled orders
        const cum_orders = {
          // today orders
          today: this.today_orders,
          // next days orders
          next_days: this.orders

        };

        // Whole order in one place
        const main_order = {
          user_id: this.userId,
          order_id: order_id,
          order_time: moment().format('llll'),
          delivery_address : delivery_address,
          payment_method: pay_method,
          order: cum_orders,
          total_price: this.total_price
        };
        // console.log(main_order);
        // Send order to backend
        // var json = { 'name': catName };
        const json = {'order_dets': main_order};
        console.log(json);

        if (this.payment_method !== 'cod') {
          if (this.payment_method === 'wallet') {
            this.options = {
              'key': 'rzp_test_hJMKKQwECWfY82',
              'amount': this.total_to_pay * 100, // 2000 paise = INR 20
              'name': 'Fysy',
              'description': 'Purchase Description',
              'image': '../../assets/logo/logo_black.png',
              'handler': function (response){
                  alert(response.razorpay_payment_id);
              },
              'prefill': {
                  'name': this.userName,
                  'email': this.userEmail,
                  'contact': this.userMobile,
                  'method': this.payment_method
              },
              'notes': {
                  'address': this.deliveryInst
              },
              'theme': {
                  'color': '#F37254'
              }
            };
          }else {
            this.options = {
              'key': 'rzp_test_hJMKKQwECWfY82',
              'amount': this.total_to_pay * 100, // 2000 paise = INR 20
              'name': 'Fysu',
              'description': 'Purchase Description',
              'image': '../../assets/logo/logo_black.png',
              'handler': function (response){
                  alert(response.razorpay_payment_id);
              },
              'prefill': {
                  'name': this.userName,
                  'email': this.userEmail,
                  'contact': this.userMobile
              },
              'notes': {
                  'address': this.deliveryInst
              },
              'theme': {
                  'color': '#F37254'
              }
            };
          }


        this.rzp1 = new this.winRef.nativeWindow.Razorpay(this.options);
        this.rzp1.open();
        }


        // this.authService.postOrder(json).subscribe(res=>{
        //   if(res.success){
        //     console.log(res.msg);
        //     // Save order id to local storage
        //     // localStorage.setItem('order_id',order_id);
        //     // localStorage.removeItem('all_orders');
        //     // localStorage.removeItem('today_orders');
        //     // redirect to thanks page
        //     // this.router.navigate(['/thanks']);
        //   }else{
        //     $('.err').html('Something went wrong. please try again later');
        //   }
        // });

      }
    }



    // Get payment type
    // alert(this.payment_method+' AND '+this.deliveryInst+ ' AND ' +order_id);
    // Make order

  }

  getSlotValue(slot) {
    switch (slot) {
      case 'slot_one':
        return '12:00PM - 12:45PM';
        // break;/
      case 'slot_two':
        return '12:45PM - 1:30PM';
        // break;
      case 'slot_three':
        return '1:30PM - 2:15PM';
      case 'slot_four':
        return '2:15PM - 3:00PM';
        // break;

      default:
        break;
    }
  }

  editAddress(i, address) {
    this.original_address = address;
    this.placeholder_address = address;
    $('.db').css({'display': 'flex'});
  }
  updateAddress() {
    // alert('fd');
    const addresses = {
      user_id: this.userId,
      original : this.original_address,
      edited : this.placeholder_address
    };
    this.authService.updateAddress(addresses).subscribe(res => {
      if (res.success) {
        window.location.reload();
      }else {
        console.log(res.msg);
      }
    });
  }
  closeUpAddress() {
    $('.db').css({'display': 'none'});
  }
  removeDate(day) {
    switch (day) {

      case 'tab_one':
        // Remove tab_one from orders
        this.today_orders['tab_one'] = null;
        this.tab_one = null;
        // Update from localstorage
        localStorage.setItem('today_orders', JSON.stringify(this.today_orders));
        // Minus the cost from total
        this.total_price = this.total_price - this.tab_one_total_price;
        this.total_to_pay = this.total_to_pay - this.tab_one_total_price;
        break;
      case 'tab_two':
        // Remove tab_one from orders
        this.today_orders['tab_two'] = null;
        this.tab_two = null;
        // Update from localstorage
        localStorage.setItem('today_orders', JSON.stringify(this.today_orders));
        // Minus the cost from total
        this.total_price = this.total_price - this.tab_two_total_price;
        this.total_to_pay = this.total_to_pay - this.tab_two_total_price;

        break;

      case 'tab_three':
        // Remove tab_one from orders
        this.today_orders['tab_three'] = null;
        this.tab_three = null;
        // Update from localstorage
        localStorage.setItem('today_orders', JSON.stringify(this.today_orders));
        // Minus the cost from total
        this.total_price = this.total_price - this.tab_three_total_price;
        this.total_to_pay = this.total_to_pay - this.tab_three_total_price;
        break;

      case 'day_one':
        // Remove day one from orders
        this.orders['day_one'] = null;
        this.day_one_date = null;
        // Update LocalStorage
        localStorage.setItem('all_orders', JSON.stringify(this.orders));
        // Minus the cost from total
        this.total_price = this.total_price - this.day_one_total_price;
        this.total_to_pay = this.total_to_pay - this.day_one_total_price;
        break;

      case 'day_two':
        // Remove day one from orders
        this.orders['day_two'] = null;
        this.day_two_date = null;
        // Update LocalStorage
        localStorage.setItem('all_orders', JSON.stringify(this.orders));
        // Minus the cost from total
        this.total_price = this.total_price - this.day_two_total_price;
        this.total_to_pay = this.total_to_pay - this.day_two_total_price;
        break;

      case 'day_three':
        // Remove day one from orders
        this.orders['day_three'] = null;
        this.day_three_date = null;
        // Update LocalStorage
        localStorage.setItem('all_orders', JSON.stringify(this.orders));
        // Minus the cost from total
        this.total_price = this.total_price - this.day_three_total_price;
        this.total_to_pay = this.total_to_pay - this.day_three_total_price;
        break;

      case 'day_four':
        // Remove day one from orders
        this.orders['day_four'] = null;
        this.day_four_date = null;
        // Update LocalStorage
        localStorage.setItem('all_orders', JSON.stringify(this.orders));
        // Minus the cost from total
        this.total_price = this.total_price - this.day_four_total_price;
        this.total_to_pay = this.total_to_pay - this.day_four_total_price;
        break;

      case 'day_five':
        // Remove day one from orders
        this.orders['day_five'] = null;
        this.day_five_date = null;
        // Update LocalStorage
        localStorage.setItem('all_orders', JSON.stringify(this.orders));
        // Minus the cost from total
        this.total_price = this.total_price - this.day_five_total_price;
        this.total_to_pay = this.total_to_pay - this.day_five_total_price;
        break;

      default:
        break;
    }
    if (this.total_price === 0) {
      this.router.navigate(['/menu']);
    }
  }
  changeDets(order_tab) {
    switch (order_tab) {
      case 'tab_one':
        this.tab_one_change_status = true;
        this.tab_two_change_status = false;
        this.tab_three_change_status = false;
        this.day_one_change_status = false;
        this.day_two_change_status = false;
        this.day_three_change_status = false;
        this.day_four_change_status = false;
        this.day_five_change_status = false;

        break;
      case 'tab_two':
        this.tab_one_change_status = false;
        this.tab_two_change_status = true;
        this.tab_three_change_status = false;
        this.day_one_change_status = false;
        this.day_two_change_status = false;
        this.day_three_change_status = false;
        this.day_four_change_status = false;
        this.day_five_change_status = false;

        break;
      case 'tab_three':
        this.tab_one_change_status = false;
        this.tab_two_change_status = false;
        this.tab_three_change_status = true;
        this.day_one_change_status = false;
        this.day_two_change_status = false;
        this.day_three_change_status = false;
        this.day_four_change_status = false;
        this.day_five_change_status = false;

        break;
      case 'day_one':
        this.tab_one_change_status = false;
        this.tab_two_change_status = false;
        this.tab_three_change_status = false;
        this.day_one_change_status = true;
        this.day_two_change_status = false;
        this.day_three_change_status = false;
        this.day_four_change_status = false;
        this.day_five_change_status = false;
        // Now
        break;
      case 'day_two':
        // $('.today-menu-back').css('display','flex');
        this.tab_one_change_status = false;
        this.tab_two_change_status = false;
        this.tab_three_change_status = false;
        this.day_one_change_status = false;
        this.day_two_change_status = true;
        this.day_three_change_status = false;
        this.day_four_change_status = false;
        this.day_five_change_status = false;

        break;
      case 'day_three':
        this.tab_one_change_status = false;
        this.tab_two_change_status = false;
        this.tab_three_change_status = false;
        this.day_one_change_status = false;
        this.day_two_change_status = false;
        this.day_three_change_status = true;
        this.day_four_change_status = false;
        this.day_five_change_status = false;

        break;
      case 'day_four':
        this.tab_one_change_status = false;
        this.tab_two_change_status = false;
        this.tab_three_change_status = false;
        this.day_one_change_status = false;
        this.day_two_change_status = false;
        this.day_three_change_status = false;
        this.day_four_change_status = true;
        this.day_five_change_status = false;
        break;
      case 'day_five':
        this.tab_one_change_status = false;
        this.tab_two_change_status = false;
        this.tab_three_change_status = false;
        this.day_one_change_status = false;
        this.day_two_change_status = false;
        this.day_three_change_status = false;
        this.day_four_change_status = false;
        this.day_five_change_status = true;
        break;

      default:
        break;
    }
    $('.today-menu-back').css('display', 'flex');
  }
  tdClose() {
    $('.today-menu-back').hide();
  }
  addTodayCartClicked() {
    switch (true) {
      case this.tab_one_change_status:
        this.today_orders['tab_one'].time_slot = this.schSlot;
        this.tab_one_time_slot = this.getSlotValue(this.schSlot);
        break;
      case this.tab_two_change_status:
        this.today_orders['tab_two'].time_slot = this.schSlot;
        this.tab_two_time_slot = this.getSlotValue(this.schSlot);
        break;
      case this.tab_three_change_status:
        this.today_orders['tab_three'].time_slot = this.schSlot;
        this.tab_three_time_slot = this.getSlotValue(this.schSlot);
        break;
      case this.day_one_change_status:
        // alert(this.schTimes);
        if (this.orders['day_one'] != null) {
          // this.day_one_per_portion_price = this.orders['day_one'].perPortionPrice;
          // this.day_one_total_price = this.orders['day_one'].totalPrice;
          // this.day_one_num_items = this.orders['day_one'].numOfTimes;
          // this.day_one_slot = this.schSlot;
          // Time slots
          switch (this.schSlot) {
            case 'slot_one':
              this.day_one_slot = this.slot_one;
              break;
            case 'slot_two':
              this.day_one_slot = this.slot_two;
              break;
            case 'slot_three':
              this.day_one_slot = this.slot_three;
              break;
            default:
              break;
          }
        }
        this.orders['day_one'].timeSlot = this.schSlot;
        console.log(this.orders);
        break;
      case this.day_two_change_status:
          if (this.orders['day_two'] != null) {
            // this.day_two_per_portion_price = this.orders['day_two'].perPortionPrice;
            // this.day_two_total_price = this.orders['day_two'].totalPrice;
            // this.day_two_num_items = this.orders['day_two'].numOfTimes;
            // this.day_two_slot = this.schSlot;
            // Time slots
            switch (this.schSlot) {
              case 'slot_one':
                this.day_two_slot = this.slot_one;
                break;
              case 'slot_two':
                this.day_two_slot = this.slot_two;
                break;
              case 'slot_three':
                this.day_two_slot = this.slot_three;
                break;
              default:
                break;
            }
          }

        break;
      case this.day_three_change_status:
      if (this.orders['day_three'] != null) {
        // this.day_three_per_portion_price = this.orders['day_three'].perPortionPrice;
        // this.day_three_total_price = this.orders['day_three'].totalPrice;
        // this.day_three_num_items = this.orders['day_three'].numOfTimes;
        // this.day_three_slot = this.schSlot;
        // Time slots
        switch (this.schSlot) {
          case 'slot_one':
            this.day_three_slot = this.slot_one;
            break;
          case 'slot_two':
            this.day_three_slot = this.slot_two;
            break;
          case 'slot_three':
            this.day_three_slot = this.slot_three;
            break;
          default:
            break;
        }
      }

        break;
      case this.day_four_change_status:
        if (this.orders['day_four'] != null) {
          // this.day_four_per_portion_price = this.orders['day_four'].perPortionPrice;
          // this.day_four_total_price = this.orders['day_four'].totalPrice;
          // this.day_four_num_items = this.orders['day_four'].numOfTimes;
          // this.day_four_slot = this.schSlot;
          // Time slots
          switch (this.schSlot) {
            case 'slot_one':
              this.day_four_slot = this.slot_one;
              break;
            case 'slot_two':
              this.day_four_slot = this.slot_two;
              break;
            case 'slot_three':
              this.day_four_slot = this.slot_three;
              break;
            default:
              break;
          }
        }

        break;
      case this.day_five_change_status:
        if (this.orders['day_five'] != null) {
          // this.day_five_per_portion_price = this.orders['day_five'].perPortionPrice;
          // this.day_five_total_price = this.orders['day_five'].totalPrice;
          // this.day_five_num_items = this.orders['day_five'].numOfTimes;
          // this.day_five_slot = this.schSlot;
          // Time slots
          switch (this.schSlot) {
            case 'slot_one':
              this.day_five_slot = this.slot_one;
              break;
            case 'slot_two':
              this.day_five_slot = this.slot_two;
              break;
            case 'slot_three':
              this.day_five_slot = this.slot_three;
              break;
            default:
              break;
          }
        }

        break;

      default:
        break;
    }
    $('.today-menu-back').hide();
  }
}
