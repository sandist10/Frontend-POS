<script setup>
import { ref, computed } from "vue";
import Button from "primevue/button";
import Tag from "primevue/tag";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import Textarea from "primevue/textarea";
import Dropdown from "primevue/dropdown";

/* ================= DATA PRODUK ================= */
const products = ref([
  {
    id: 1,
    name: "Nasi Goreng Spesial",
    category: "Makanan",
    price: 25000,
    stock: 50,
    desc: "Nasi goreng lengkap dengan topping telur dan ayam",
    img: new URL('@/assets/img/nasigoreng.jpeg', import.meta.url).href,
  },
  {
    id: 2,
    name: "Es Teh Manis",
    category: "Minuman",
    price: 8000,
    stock: 100,
    desc: "Teh manis dingin segar pelepas dahaga",
    img: new URL('@/assets/img/esteh.jpeg', import.meta.url).href,
  },
  {
    id: 3,
    name: "Ayam Geprek",
    category: "Makanan",
    price: 22000,
    stock: 40,
    desc: "Ayam goreng crispy dengan sambal pedas",
    img: new URL('@/assets/img/ayamgeprek.jpeg', import.meta.url).href,
  },
  {
    id: 4,
    name: "Mie Ayam",
    category: "Makanan",
    price: 18000,
    stock: 60,
    desc: "Mie ayam dengan topping ayam melimpah",
    img: new URL('@/assets/img/mieayam.jpeg', import.meta.url).href,
  },
  {
    id: 5,
    name: "Bakso",
    category: "Makanan",
    price: 20000,
    stock: 70,
    desc: "Bakso sapi dengan kuah gurih",
    img: new URL('@/assets/img/bakso.jpeg', import.meta.url).href,
  },
  {
    id: 6,
    name: "Es Jeruk",
    category: "Minuman",
    price: 9000,
    stock: 90,
    desc: "Minuman jeruk segar dingin",
    img: new URL('@/assets/img/esjeruk.jpeg', import.meta.url).href,
  },
  {
    id: 7,
    name: "Kentang Goreng",
    category: "Snack",
    price: 15000,
    stock: 80,
    desc: "Kentang goreng renyah dan gurih",
    img: new URL('@/assets/img/kentang.jpeg', import.meta.url).href,
  },
  {
    id: 8,
    name: "Burger",
    category: "Makanan",
    price: 28000,
    stock: 35,
    desc: "Burger daging sapi dengan sayur segar",
    img: new URL('@/assets/img/burgers.jpeg', import.meta.url).href,
  },
  {
    id: 9,
    name: "Pizza Slice",
    category: "Makanan",
    price: 30000,
    stock: 25,
    desc: "Potongan pizza dengan topping keju",
    img: new URL('@/assets/img/pizza.jpeg', import.meta.url).href,
  },
  {
    id: 10,
    name: "Es Kopi Susu",
    category: "Minuman",
    price: 18000,
    stock: 55,
    desc: "Kopi susu dingin kekinian",
    img: new URL('@/assets/img/eskopi.jpeg', import.meta.url).href,
  },
]);

/* ================= CATEGORY ================= */
const categories = ref(["Semua", "Makanan", "Minuman", "Snack"]);

/* ================= FILTER ================= */
const search = ref("");
const activeFilter = ref("Semua");

const filteredProducts = computed(() => {
  return products.value.filter((p) => {
    const matchSearch = p.name
      .toLowerCase()
      .includes(search.value.toLowerCase());
    const matchCategory =
      activeFilter.value === "Semua" || p.category === activeFilter.value;
    return matchSearch && matchCategory;
  });
});

const setFilter = (c) => (activeFilter.value = c);

/* ================= STATISTIK ================= */
const totalProducts = computed(() => products.value.length);
const totalStock = computed(() =>
  products.value.reduce((sum, p) => sum + Number(p.stock), 0)
);
const totalActiveCategories = computed(() =>
  categories.value.filter((c) => c !== "Semua").length
);

/* ================= TAMBAH PRODUK ================= */
const showAddModal = ref(false);
const newProduct = ref({
  name: "",
  category: "",
  price: null,
  stock: null,
  desc: "",
  img: "",
});

const onAddImage = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  newProduct.value.img = URL.createObjectURL(file);
};

const addProduct = () => {
  if (
    !newProduct.value.name ||
    !newProduct.value.category ||
    !newProduct.value.price ||
    !newProduct.value.stock ||
    !newProduct.value.img
  ) {
    alert("Semua field wajib diisi!");
    return;
  }

  products.value.push({
    id: Date.now(),
    ...newProduct.value,
    price: Number(newProduct.value.price),
    stock: Number(newProduct.value.stock),
  });

  resetNewProduct();
  showAddModal.value = false;
};

const resetNewProduct = () => {
  newProduct.value = {
    name: "",
    category: "",
    price: null,
    stock: null,
    desc: "",
    img: "",
  };
};

/* ================= EDIT PRODUK ================= */
const showEditModal = ref(false);
const editingProduct = ref(null);

const openEdit = (p) => {
  editingProduct.value = { ...p };
  showEditModal.value = true;
};

const onEditImage = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  editingProduct.value.img = URL.createObjectURL(file);
};

const saveEdit = () => {
  const idx = products.value.findIndex(
    (p) => p.id === editingProduct.value.id
  );

  if (idx !== -1) {
    products.value[idx] = {
      ...editingProduct.value,
      price: Number(editingProduct.value.price),
      stock: Number(editingProduct.value.stock),
    };
  }

  showEditModal.value = false;
};

/* ================= DELETE ================= */
const deleteProduct = (id) => {
  if (confirm("Yakin ingin menghapus produk ini?")) {
    products.value = products.value.filter((p) => p.id !== id);
  }
};

/* ================= TAMBAH KATEGORI ================= */
const showCategoryModal = ref(false);
const newCategory = ref("");

const addCategory = () => {
  if (!newCategory.value.trim()) return;

  if (categories.value.includes(newCategory.value)) {
    alert("Kategori sudah ada!");
    return;
  }

  categories.value.push(newCategory.value);
  newCategory.value = "";
  showCategoryModal.value = false;
};
</script>

<template>
  <div class="p-5 w-full">
    <!-- HEADER -->
    <div class="flex justify-between items-center mb-5">
      <h2 class="text-2xl font-semibold">Daftar Produk</h2>
      <div class="flex gap-2">
        <Button label="Tambah Kategori" icon="pi pi-tag" severity="success" @click="showCategoryModal = true" />
        <Button label="Tambah Produk" icon="pi pi-plus" @click="showAddModal = true" />
      </div>
    </div>

    <!-- STATISTIK -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="stat-card">
        <p>Total Produk</p>
        <h3>{{ totalProducts }}</h3>
      </div>
      <div class="stat-card">
        <p>Total Stok</p>
        <h3>{{ totalStock }}</h3>
      </div>
      <div class="stat-card">
        <p>Kategori Aktif</p>
        <h3>{{ totalActiveCategories }}</h3>
      </div>
    </div>

    <!-- FILTER -->
    <div class="box mb-4">
      <div class="flex flex-wrap gap-3">
        <InputText v-model="search" placeholder="Cari produk..." />
        <div class="flex gap-2 flex-wrap">
          <Button
            v-for="c in categories"
            :key="c"
            :label="c"
            size="small"
            :severity="activeFilter === c ? 'primary' : 'secondary'"
            @click="setFilter(c)"
          />
        </div>
      </div>
    </div>

    <!-- TABLE -->
    <div class="box overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <th>Gambar</th>
            <th>Nama</th>
            <th>Kategori</th>
            <th>Harga</th>
            <th>Stok</th>
            <th>Deskripsi</th>
            <th width="160">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in filteredProducts" :key="p.id">
            <td><img :src="p.img" class="thumb" /></td>
            <td>{{ p.name }}</td>
            <td><Tag :value="p.category" /></td>
            <td>Rp {{ p.price.toLocaleString() }}</td>
            <td>{{ p.stock }}</td>
            <td class="max-w-xs truncate">{{ p.desc }}</td>
            <td class="flex gap-2">
              <Button size="small" icon="pi pi-pencil" severity="info" @click="openEdit(p)" />
              <Button size="small" icon="pi pi-trash" severity="danger" @click="deleteProduct(p.id)" />
            </td>
          </tr>

          <tr v-if="filteredProducts.length === 0">
            <td colspan="7" class="text-center py-4 opacity-60">
              Data produk tidak ditemukan
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ================= MODAL TAMBAH PRODUK ================= -->
    <Dialog v-model:visible="showAddModal" modal header="Tambah Produk" :style="{ width: '600px' }">
      <div class="form">
        <label>Nama Produk</label>
        <InputText v-model="newProduct.name" />

        <label>Kategori</label>
        <Dropdown v-model="newProduct.category" :options="categories.filter(c => c !== 'Semua')" />

        <label>Harga</label>
        <InputText type="number" v-model="newProduct.price" />

        <label>Stok</label>
        <InputText type="number" v-model="newProduct.stock" />

        <label>Deskripsi</label>
        <Textarea v-model="newProduct.desc" rows="3" />

        <label>Gambar</label>
        <input type="file" class="input-file" @change="onAddImage" />
        <img v-if="newProduct.img" :src="newProduct.img" class="preview" />

        <Button label="Simpan Produk" @click="addProduct" />
      </div>
    </Dialog>

    <!-- ================= MODAL EDIT PRODUK ================= -->
    <Dialog v-model:visible="showEditModal" modal header="Edit Produk" :style="{ width: '600px' }">
      <div class="form" v-if="editingProduct">
        <label>Nama Produk</label>
        <InputText v-model="editingProduct.name" />

        <label>Kategori</label>
        <Dropdown v-model="editingProduct.category" :options="categories.filter(c => c !== 'Semua')" />

        <label>Harga</label>
        <InputText type="number" v-model="editingProduct.price" />

        <label>Stok</label>
        <InputText type="number" v-model="editingProduct.stock" />

        <label>Deskripsi</label>
        <Textarea v-model="editingProduct.desc" rows="3" />

        <label>Gambar</label>
        <input type="file" class="input-file" @change="onEditImage" />
        <img v-if="editingProduct.img" :src="editingProduct.img" class="preview" />

        <Button label="Simpan Perubahan" severity="info" @click="saveEdit" />
      </div>
    </Dialog>

    <!-- ================= MODAL TAMBAH KATEGORI ================= -->
    <Dialog v-model:visible="showCategoryModal" modal header="Tambah Kategori" :style="{ width: '600px' }">
      <div class="form">
        <label>Nama Kategori</label>
        <InputText v-model="newCategory" placeholder="Contoh: Dessert" />
        <Button label="Simpan Kategori" severity="success" @click="addCategory" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.stat-card {
  padding: 20px;
  border-radius: 12px;
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  text-align: center;
}

.box {
  background: var(--surface-card);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--surface-border);
}

.table {
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
}

.table th {
  position: sticky;
  top: 0;
  padding: 12px;
  background: var(--surface-section);
  border-bottom: 2px solid var(--surface-border);
  text-align: left;
}

.table td {
  padding: 12px;
  border-bottom: 1px solid var(--surface-border);
}

.table tbody tr:hover {
  background: var(--surface-hover);
}

.thumb {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.preview {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-top: 8px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-file {
  border: 1px solid var(--surface-border);
  padding: 8px;
  border-radius: 6px;
  background: var(--surface-card);
  cursor: pointer;
}
</style>
