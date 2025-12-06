<script setup>
import { ref, computed } from "vue";
import Chart from "primevue/chart";

/* ================== DATA DUMMY (10 DATA) ================== */
const transaksi = ref([
  { id: 1, tanggal: "2025-01-01", penjualan: 7500000, hpp: 4500000 },
  { id: 2, tanggal: "2025-01-02", penjualan: 6800000, hpp: 4200000 },
  { id: 3, tanggal: "2025-01-03", penjualan: 8200000, hpp: 5000000 },
  { id: 4, tanggal: "2025-01-04", penjualan: 9100000, hpp: 5600000 },
  { id: 5, tanggal: "2025-01-05", penjualan: 6400000, hpp: 3900000 },
  { id: 6, tanggal: "2025-01-06", penjualan: 7200000, hpp: 4300000 },
  { id: 7, tanggal: "2025-01-07", penjualan: 8800000, hpp: 5400000 },
  { id: 8, tanggal: "2025-01-08", penjualan: 7900000, hpp: 4800000 },
  { id: 9, tanggal: "2025-01-09", penjualan: 9600000, hpp: 6100000 },
  { id: 10, tanggal: "2025-01-10", penjualan: 10200000, hpp: 6600000 }
]);

/* ================== PERHITUNGAN LABA KOTOR ================== */
const totalPenjualan = computed(() =>
  transaksi.value.reduce((t, x) => t + x.penjualan, 0)
);

const totalHPP = computed(() =>
  transaksi.value.reduce((t, x) => t + x.hpp, 0)
);

const totalLabaKotor = computed(() =>
  transaksi.value.reduce((t, x) => t + (x.penjualan - x.hpp), 0)
);

/* ================== CHART LABA KOTOR ================== */
const chartData = computed(() => ({
  labels: transaksi.value.map(t => t.tanggal),
  datasets: [
    {
      label: "Laba Kotor",
      data: transaksi.value.map(t => t.penjualan - t.hpp),
      backgroundColor: "#42A5F5",
      borderColor: "#1976D2",
      fill: false,
      tension: 0.4
    }
  ]
}));

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: "#9CA3AF" }
    }
  },
  scales: {
    x: {
      ticks: { color: "#9CA3AF" },
      grid: { color: "#374151" }
    },
    y: {
      ticks: { color: "#9CA3AF" },
      grid: { color: "#374151" }
    }
  }
});
</script>

<template>
  <div class="p-5 w-full text-gray-900 dark:text-gray-100">

    <h2 class="text-2xl font-semibold mb-5">
      Laporan Laba Kotor
    </h2>

    <!-- ================== STATISTIK ================== -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="p-4 rounded-lg shadow bg-white dark:bg-gray-800">
        <p class="text-sm text-gray-500">Total Penjualan</p>
        <p class="text-2xl font-semibold">
          Rp {{ totalPenjualan.toLocaleString() }}
        </p>
      </div>

      <div class="p-4 rounded-lg shadow bg-white dark:bg-gray-800">
        <p class="text-sm text-gray-500">Total HPP</p>
        <p class="text-2xl font-semibold text-red-500">
          Rp {{ totalHPP.toLocaleString() }}
        </p>
      </div>

      <div class="p-4 rounded-lg shadow bg-white dark:bg-gray-800">
        <p class="text-sm text-gray-500">Total Laba Kotor</p>
        <p class="text-2xl font-semibold text-blue-600">
          Rp {{ totalLabaKotor.toLocaleString() }}
        </p>
      </div>
    </div>

    <!-- ================== CHART ================== -->
    <div
      class="p-5 rounded-lg shadow bg-white dark:bg-gray-800 mb-6"
      style="height: 350px;"
    >
      <Chart type="line" :data="chartData" :options="chartOptions" />
    </div>

    <!-- ================== TABLE ================== -->
    <div class="rounded-xl p-5 shadow bg-white dark:bg-gray-800">
      <table class="min-w-full border-collapse">
        <thead>
          <tr class="bg-gray-100 dark:bg-gray-700">
            <th class="p-3 text-left">Tanggal</th>
            <th class="p-3 text-left">Penjualan</th>
            <th class="p-3 text-left">HPP</th>
            <th class="p-3 text-left">Laba Kotor</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="t in transaksi"
            :key="t.id"
            class="border-b dark:border-gray-700"
          >
            <td class="p-3">{{ t.tanggal }}</td>

            <td class="p-3">
              Rp {{ t.penjualan.toLocaleString() }}
            </td>

            <td class="p-3 text-red-500">
              Rp {{ t.hpp.toLocaleString() }}
            </td>

            <td class="p-3 font-semibold text-blue-600">
              Rp {{ (t.penjualan - t.hpp).toLocaleString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>
