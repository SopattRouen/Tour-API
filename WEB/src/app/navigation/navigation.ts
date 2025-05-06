// ==========================================================>> Custom Library
import { NavigationItem } from 'helpers/components/navigation';
let isAdmin = true;

export const defaultNavigation: NavigationItem[] = [
    //===================================>> Dashboard
    {
        id   : 'dashboard',
        title: 'ផ្ទាំងព័ត៌មាន',
        type : 'basic',
        icon : 'mat_outline:dashboard',
        link : '/dashboard'
    },
    //===================================>> POS
    {
        id       : 'bookings',
        title    : 'ការកក់',
        type     : 'basic',
        icon     : 'mat_solid:desktop_mac',
        link     : '/bookings',
    },
    //===================================>> Sale

    //===================================>> Product
    {
        hidden() {
            isAdmin = true;
            if(localStorage.getItem('role') == 'Admin'){
                isAdmin = false;
            }
            return isAdmin;
        },
        
        id       : 'all',
        title    : 'ទាំងអស់',
        type     : 'collapsable',
        icon     : 'mat_solid:shop_two',
        children : [
            {
                id       : 'contries',
                title    : 'ប្រទេស',
                type     : 'basic',
                icon     : 'mat_solid:shopping_cart',
                link     : 'all/contries',
            },
            {
                id       : 'cities',
                title    : 'ទីក្រុង',
                type     : 'basic',
                icon     : 'mat_solid:shopping_cart',
                link     : 'all/cities',
            },
        ],
    },
    //===========================================>>User
    {
        hidden() {
            isAdmin = true;
            if(localStorage.getItem('role') == 'Admin'){
                isAdmin = false;
            }
            return isAdmin;
        },
        id   : 'user',
        title: 'អ្នកប្រើប្រាស់',
        type : 'basic',
        icon : 'mat_outline:people',
        link : '/users',
    },
    {
        id   : 'profile',
        title: 'គណនី',
        type : 'basic',
        icon : 'mat_outline:person',
        link : '/my-profile'
    },
];
