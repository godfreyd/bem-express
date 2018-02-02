// modules.define('lang-switcher', ['i-bem-dom', 'popup', 'menu', 'menu__item'],
//     function(provide, bemDom, Popup, Menu, MenuItem) {

//     provide(bemDom.declBlock(this.name, {
//         onSetMod: {
//             js: {
//                 inited: function() {
//                     // this.popup = this.findChildBlock(Popup);
//                     // this.menu = this.findChildBlock(Menu);

//                     // console.log(this.popup);

//                     console.log('Я заинитился')

//                 }
//             }
//         },
//         _onMenuItemClick: function(e, data) {
//             // var val = e.bemTarget.getVal();
//             console.log('Клик по menu__item')

//             // val && this._form.findChildBlock(Input).setVal(val);
//         }
//     }, {
//         lazyInit: true,
//         onInit: function() {


//         console.log('lazyInit');

//         this._events(Menu).on('change', this._onMenuItemClick, this);


//         }
//     }));

// });

