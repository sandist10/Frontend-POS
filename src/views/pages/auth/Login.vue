<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

// Import logo dari src/assets/img
import logo from '@/assets/img/logo2.png';

const router = useRouter();
const toast = useToast();

const email = ref('');
const password = ref('');
const checked = ref(false);

const handleLogin = () => {
    if (!email.value || !password.value) {
        toast.add({
            severity: 'warn',
            summary: 'Peringatan',
            detail: 'Email dan Password wajib diisi!',
            life: 3000
        });
        return;
    }

    // Simulasi login berhasil
    localStorage.setItem('token', 'login-berhasil');

    toast.add({
        severity: 'success',
        summary: 'Login Berhasil',
        detail: 'Selamat datang di sistem POS',
        life: 2000
    });

    setTimeout(() => {
        router.push('/dashboard');
    }, 1000);
};
</script>

<template>

    <!-- Toast PrimeVue -->
    <Toast />

    <!-- Login Container -->
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">

                    <!-- Logo dan Judul -->
                    <div class="text-center mb-8">
                        <div class="flex justify-center mb-4">
                            <img :src="logo" alt="Logo POS" class="w-20 h-20 object-contain" />
                        </div>
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">
                            Semoga harimu lancar
                        </div>
                        <span class="text-muted-color font-medium">Sign in to continue</span>
                    </div>

                    <!-- Form Login -->
                    <div>
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8" v-model="email" />

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="mb-4" fluid :feedback="false" />

                        <!-- <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                            <div class="flex items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2" />
                                <label for="rememberme1">Remember me</label>
                            </div>
                            <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
                        </div> -->
                        <Button label="Sign In" class="w-full" @click="handleLogin" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye,
.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
