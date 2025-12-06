import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        // ✅ REDIRECT AWAL KE LOGIN
        {
            path: '/',
            redirect: '/auth/login'
        },

        // ==============================
        // LAYOUT UTAMA (WAJIB LOGIN)
        // ==============================
        {
            path: '/',
            component: AppLayout,
            meta: { requiresAuth: true }, // ✅ semua child wajib login
            children: [
                {
                    path: 'dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/pages/dashboard/Dashboard.vue')
                },

                {
                    path: 'kasir',
                    name: 'kasir',
                    component: () => import('@/views/pages/kasir/KasirPage.vue')
                },
                {
                    path: 'transaksi',
                    name: 'transaksi',
                    component: () => import('@/views/pages/kasir/TransaksiPage.vue')
                },

                {
                    path: 'produk',
                    name: 'produk',
                    component: () => import('@/views/pages/produk/Produk.vue')
                },

                {
                    path: 'bahan-baku',
                    name: 'bahanBaku',
                    component: () => import('@/views/pages/inventory/BahanBakuPage.vue')
                },
                
                {
                    path: 'admin',
                    name: 'kelolaAdmin',
                    component: () => import('@/views/pages/admin/KelolaAdmin.vue')
                },

                {
                    path: 'laporan/laba-bersih',
                    name: 'laporanLabaBersih',
                    component: () => import('@/views/pages/laporan/lababersih.vue')
                },
                {
                    path: 'laporan/laba-kotor',
                    name: 'laporanLabaKotor',
                    component: () => import('@/views/pages/laporan/labahkotor.vue')
                },

                {
                    path: 'profil',
                    name: 'profil',
                    component: () => import('@/views/pages/profil/ProfilPage.vue')
                }
            ]
        },

        // ==============================
        // AUTH
        // ==============================
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue'),
            meta: { guest: true }
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        },
    ]
});

/* ==============================
   ✅ AUTH GUARD UTAMA
============================== */
router.beforeEach((to, from, next) => {
    const isLogin = localStorage.getItem('token'); // token login kamu

    // Belum login tapi masuk halaman protected
    if (to.meta.requiresAuth && !isLogin) {
        next('/auth/login');
    }
    // Sudah login tapi buka halaman login
    else if (to.meta.guest && isLogin) {
        next('/dashboard');
    }
    else {
        next();
    }
});

export default router;
