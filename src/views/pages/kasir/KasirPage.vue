<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

/* === PRIMEVUE === */
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Divider from 'primevue/divider';

/* === DATA PRODUK === */
const products = ref([
  {
    id: 1,
    name: "Nasi Goreng",
    category: "Makanan",
    price: 25000,
    stock: 50,
    img: "https://source.unsplash.com/300x300/?fried-rice"
  },
  {
    id: 2,
    name: "Es Teh Manis",
    category: "Minuman",
    price: 5000,
    stock: 40,
    img: "https://source.unsplash.com/300x300/?iced-tea"
  },
  {
    id: 3,
    name: "Ayam Crispy",
    category: "Snack",
    price: 10000,
    stock: 25,
    img: "https://source.unsplash.com/300x300/?fried-chicken"
  },
  {
    id: 4,
    name: "Kopi Latte",
    category: "Minuman",
    price: 20000,
    stock: 30,
    img: "https://source.unsplash.com/300x300/?latte"
  },
  {
    id: 5,
    name: "Mie Goreng",
    category: "Makanan",
    price: 18000,
    stock: 45,
    img: "https://source.unsplash.com/300x300/?fried-noodles"
  },
  {
    id: 6,
    name: "Burger",
    category: "Makanan",
    price: 30000,
    stock: 20,
    img: "https://source.unsplash.com/300x300/?burger"
  },
  {
    id: 7,
    name: "Kentang Goreng",
    category: "Snack",
    price: 15000,
    stock: 35,
    img: "https://source.unsplash.com/300x300/?french-fries"
  },
  {
    id: 8,
    name: "Milkshake Coklat",
    category: "Minuman",
    price: 22000,
    stock: 18,
    img: "https://source.unsplash.com/300x300/?chocolate-milkshake"
  },
  {
    id: 9,
    name: "Sate Ayam",
    category: "Makanan",
    price: 28000,
    stock: 22,
    img: "https://source.unsplash.com/300x300/?chicken-satay"
  },
  {
    id: 10,
    name: "Donat",
    category: "Snack",
    price: 8000,
    stock: 60,
    img: "https://source.unsplash.com/300x300/?donut"
  }
]);

const categories = ref(['Semua', 'Makanan', 'Minuman', 'Snack']);
const selectedCategory = ref('Semua');
const query = ref('');

/* === FILTER PRODUK === */
const filteredProducts = computed(() => {
    const q = query.value.toLowerCase();
    return products.value.filter((p) => {
        const matchQ = p.name.toLowerCase().includes(q);
        const matchCat = selectedCategory.value === 'Semua' || p.category === selectedCategory.value;
        return matchQ && matchCat;
    });
});

/* === KERANJANG === */
const cart = ref([]);
const discount = ref(0);
const taxPercent = ref(10);
const payment = ref(0);

const toast = useToast();

const addToCart = (p) => {
    const exist = cart.value.find((i) => i.id === p.id);
    if (exist) {
        if (exist.qty < p.stock) exist.qty++;
        else toast.add({ severity: 'warn', summary: 'Stok Habis', detail: 'Tidak bisa menambah lagi.' });
    } else {
        cart.value.push({ id: p.id, name: p.name, qty: 1, price: p.price });
    }
};

const changeQty = (item, delta) => {
    const next = item.qty + delta;
    if (next < 1) return;
    const prod = products.value.find((x) => x.id === item.id);
    if (next > prod.stock) {
        toast.add({ severity: 'warn', summary: 'Stok Habis', detail: 'Jumlah melebihi stok.' });
        return;
    }
    item.qty = next;
};

const removeFromCart = (id) => {
    cart.value = cart.value.filter((i) => i.id !== id);
};

/* === PERHITUNGAN === */
const subtotal = computed(() => cart.value.reduce((s, i) => s + i.qty * i.price, 0));
const tax = computed(() => Math.round(Math.max(0, subtotal.value - discount.value) * (taxPercent.value / 100)));
const total = computed(() => Math.max(0, subtotal.value - discount.value + tax.value));
const change = computed(() => Math.max(0, payment.value - total.value));

/* === ACTION === */
const clearCart = async () => {
    const c = await Swal.fire({
        title: 'Batalkan transaksi?',
        icon: 'warning',
        showCancelButton: true
    });
    if (c.isConfirmed) {
        cart.value = [];
        payment.value = 0;
        discount.value = 0;
    }
};

const processTransaction = async () => {
    if (cart.value.length === 0) {
        toast.add({ severity: 'warn', summary: 'Kosong', detail: 'Tidak ada item di keranjang.' });
        return;
    }

    if (payment.value < total.value) {
        toast.add({ severity: 'error', summary: 'Pembayaran', detail: 'Uang tidak cukup.' });
        return;
    }

    const c = await Swal.fire({
        title: 'Proses Transaksi?',
        html: `<b>Total:</b> Rp ${total.value.toLocaleString()}`,
        icon: 'question',
        showCancelButton: true
    });

    if (c.isConfirmed) {
        Swal.fire({
            title: 'Berhasil!',
            text: 'Transaksi selesai.',
            icon: 'success',
            timer: 1400,
            showConfirmButton: false
        });

        cart.value = [];
        payment.value = 0;
        discount.value = 0;
    }
};
</script>

<template>
    <div class="page-wrapper">
        <!-- KOLOM KIRI -->
        <div class="left-panel">
            <!-- HEADER -->
            <div class="card-box">
                <div class="text-900 text-xl font-semibold mb-1">Kasir POS</div>
                <div class="text-600 text-sm">Sistem Penjualan (Point of Sale)</div>
            </div>

            <!-- FILTER -->
            <div class="card-box">
                <InputText v-model="query" placeholder="Cari produk..." class="w-full mb-3" />
                <div class="flex flex-wrap gap-2">
                    <Button
                        v-for="c in categories"
                        :key="c"
                        size="small"
                        :label="c"
                        :severity="selectedCategory === c ? 'primary' : 'secondary'"
                        :outlined="selectedCategory !== c"
                        @click="selectedCategory = c"
                    />
                </div>
            </div>

            <!-- PRODUK GRID -->
            <div class="card-box">
                <div class="product-grid">
                    <div v-for="p in filteredProducts" :key="p.id" class="product-card">
                        <img :src="p.img" class="product-img" />
                        <div class="product-info">
                            <Tag :value="p.category" severity="info" class="w-fit" />
                            <div class="font-medium">{{ p.name }}</div>
                            <div class="text-primary font-bold">Rp {{ p.price.toLocaleString() }}</div>
                            <small class="text-600">Stok: {{ p.stock }}</small>
                            <Button
                                label="Tambah"
                                icon="pi pi-plus"
                                class="p-button-sm"
                                @click="addToCart(p)"
                                :disabled="p.stock === 0"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- KOLOM KANAN -->
        <div class="right-panel card-box">
            <h2 class="text-lg font-bold mb-4">Keranjang Belanja</h2>

            <!-- Cart Items -->
            <div class="flex-1 overflow-y-auto max-h-[300px] mb-4 border rounded-lg" :class="['cart-area']">
                <!-- EMPTY -->
                <div v-if="cart.length === 0" class="text-center py-12 text-secondary">
                    <p class="text-sm">Keranjang masih kosong</p>
                    <p class="text-xs">Klik produk untuk menambah</p>
                </div>

                <!-- FILLED -->
                <div v-else class="divide-y">
                    <div
                        v-for="item in cart"
                        :key="item.id"
                        class="flex justify-between items-center p-3"
                    >
                        <div>
                            <p class="font-semibold text-sm">{{ item.name }}</p>
                            <p class="text-xs text-secondary">
                                Rp {{ item.price.toLocaleString() }}
                            </p>
                        </div>

                        <div class="flex items-center gap-2">
                            <button
                                class="qty-btn"
                                @click="changeQty(item, -1)"
                                aria-label="kurangi"
                            >−</button>

                            <span class="text-sm font-semibold">{{ item.qty }}</span>

                            <button
                                class="qty-btn"
                                @click="changeQty(item, 1)"
                                aria-label="tambah"
                            >+</button>

                            <button
                                class="remove-btn"
                                @click="removeFromCart(item.id)"
                                aria-label="hapus"
                            >×</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Summary -->
            <div class="border-t pt-4 space-y-3 summary">
                <!-- Subtotal -->
                <div class="flex justify-between text-sm">
                    <span class="text-secondary">Subtotal</span>
                    <span class="font-semibold">
                        Rp {{ subtotal.toLocaleString() }}
                    </span>
                </div>

                <!-- Diskon -->
                <div class="flex justify-between text-sm items-center">
                    <span class="text-secondary">Diskon</span>
                    <InputText
                        type="number"
                        v-model.number="discount"
                        class="w-24 text-right"
                    />
                </div>

                <!-- Pajak -->
                <div class="flex justify-between text-sm">
                    <span class="text-secondary">Pajak (10%)</span>
                    <span class="font-semibold">
                        Rp {{ tax.toLocaleString() }}
                    </span>
                </div>

                <!-- TOTAL -->
                <div class="flex justify-between text-lg font-bold border-t pt-3 total-row">
                    <span>TOTAL</span>
                    <span>Rp {{ total.toLocaleString() }}</span>
                </div>

                <!-- Uang Diterima -->
                <div class="mt-3">
                    <label class="block text-sm font-semibold text-secondary mb-2">
                        Uang Diterima
                    </label>
                    <InputText
                        type="number"
                        v-model.number="payment"
                        class="w-full text-lg font-semibold"
                        placeholder="0"
                    />
                </div>

                <!-- Kembalian -->
                <div class="change-box mt-3">
                    <div class="flex justify-between items-center">
                        <span class="text-sm font-semibold">Kembalian</span>
                        <span class="text-xl font-bold">
                            Rp {{ change.toLocaleString() }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-4 space-y-2">
                <button
                    @click="processTransaction"
                    class="action-btn primary w-full"
                >
                    <span>✓</span>
                    <span>Proses Transaksi</span>
                </button>

                <button
                    @click="clearCart"
                    class="action-btn danger w-full"
                >
                    <span>✕</span>
                    <span>Batalkan</span>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* ---------- Layout ---------- */
.page-wrapper {
    display: grid;
    grid-template-columns: 3fr 1.2fr;
    gap: 24px;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
}

.left-panel {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

/* ---------- Card base (Sakai vars) ---------- */
.card-box {
    background: var(--surface-card);
    border-radius: 14px;
    padding: 18px;
    border: 1px solid var(--surface-border);
    /* subtle elevation in light theme only; dark theme keeps it flatter */
    box-shadow: 0 2px 6px rgba(0,0,0,0.06);
}

/* reduce shadow in dark so it's not too harsh */
:deep(.layout-dark) .card-box {
    box-shadow: none;
}

/* ---------- PRODUCT GRID ---------- */
.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 20px;
}

.product-card {
    background: var(--surface-ground);
    border: 1px solid var(--surface-border);
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.16s ease, box-shadow 0.16s ease;
}

.product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}

.product-img {
    width: 100%;
    height: 155px;
    object-fit: cover;
    background: linear-gradient(90deg, rgba(0,0,0,0.02), rgba(0,0,0,0.02));
}

.product-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    align-items: start;
    width: 100%;
}

.product-info .p-button {
    width: 100%;
}

/* ---------- RIGHT PANEL / CART ---------- */
.right-panel {
    position: sticky;
    top: 20px;
    align-self: start;
    height: fit-content;
    max-height: calc(100vh - 40px);
    overflow-y: auto;
}

/* cart area (scrollable) */
.cart-area {
    background: transparent;
    border: 1px solid var(--surface-border);
    border-radius: 8px;
}

/* Qty buttons */
.qty-btn {
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid var(--surface-border);
    background: var(--surface-card);
    cursor: pointer;
    font-weight: 600;
    line-height: 1;
}
.qty-btn:hover {
    background: var(--surface-hover);
}

/* Remove (×) */
.remove-btn {
    color: var(--red-600, #dc2626);
    font-weight: 700;
    padding: 6px 8px;
    background: transparent;
    border: none;
    cursor: pointer;
}

/* Summary box */
.summary .total-row {
    color: var(--text-color);
    background: transparent;
}

/* Kembalian box */
.change-box {
    background: var(--surface-success-0, rgba(16,185,129,0.06));
    border: 1px solid var(--surface-success-1, rgba(16,185,129,0.12));
    padding: 10px;
    border-radius: 8px;
}

/* Action buttons */
.action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    border-radius: 10px;
    font-weight: 700;
    cursor: pointer;
    border: none;
}
.action-btn.primary {
    background: var(--primary-color, #16a34a);
    color: white;
}
.action-btn.danger {
    background: var(--danger-color, #dc2626);
    color: white;
}

/* Reduce heavy colors in dark */
:deep(.layout-dark) .action-btn.primary {
    filter: brightness(0.95);
}
:deep(.layout-dark) .action-btn.danger {
    filter: brightness(0.95);
}

/* ---------- Small helpers ---------- */
.text-secondary {
    color: var(--text-500);
}

/* ---------- Responsive ---------- */
@media (max-width: 1100px) {
    .page-wrapper {
        grid-template-columns: 2fr 1fr;
    }
}

@media (max-width: 900px) {
    .page-wrapper {
        grid-template-columns: 1fr;
    }
    .right-panel {
        position: relative;
        top: 0;
        margin-top: 16px;
    }
}

@media (max-width: 480px) {
    .product-grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }
}
</style>
