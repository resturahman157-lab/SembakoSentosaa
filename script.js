let keranjang = [];
let totalHarga = 0;
let semuaPesanan = [];

function tambahKeKeranjang(nama, harga, idElemen) {
    keranjang.push({ nama, harga });
    totalHarga += harga;
    document.getElementById('count').innerText = keranjang.length;

    const kartu = document.getElementById(idElemen);
    const target = document.getElementById('cart-icon');
    const rectKartu = kartu.getBoundingClientRect();
    const rectTarget = target.getBoundingClientRect();

    const bola = document.createElement('div');
    bola.className = 'bola-terbang';
    bola.style.left = `${rectKartu.left + 80}px`;
    bola.style.top = `${rectKartu.top}px`;
    document.body.appendChild(bola);

    setTimeout(() => {
        bola.style.left = `${rectTarget.left}px`;
        bola.style.top = `${rectTarget.top}px`;
        bola.style.transform = 'scale(0.1)';
        bola.style.opacity = '0';
    }, 50);

    setTimeout(() => bola.remove(), 750);
}

function bukaModal() {
    const list = document.getElementById('daftar-belanja');
    list.innerHTML = ""; 
    
    if (keranjang.length === 0) {
        list.innerHTML = "<p style='text-align:center; color:#94A3B8;'>Keranjang kosong.</p>";
    } else {
        keranjang.forEach((item, index) => {
            const row = document.createElement('div');
            row.style.display = "flex";
            row.style.justifyContent = "space-between";
            row.style.marginBottom = "10px";
            row.innerHTML = `<span>${index+1}. ${item.nama}</span> <strong>Rp ${item.harga.toLocaleString()}</strong>`;
            list.appendChild(row);
        });
    }

    document.getElementById('total-harga').innerText = "Rp " + totalHarga.toLocaleString();
    document.getElementById('modal-bayar').style.display = 'block';
}

function tutupModal() { document.getElementById('modal-bayar').style.display = 'none'; }

function prosesBayar(event) {
    event.preventDefault();
    if (keranjang.length === 0) return;

    const nama = document.getElementById('input-nama').value;
    const alamat = document.getElementById('input-alamat').value;
    const daftarBarang = keranjang.map(item => item.nama).join(" | ");

    semuaPesanan.push({
        Waktu: new Date().toLocaleString('id-ID'),
        Nama: nama,
        Alamat: alamat,
        Pesanan: daftarBarang,
        Total: totalHarga
    });

    const btn = document.querySelector('.btn-final');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';
    btn.disabled = true;

    setTimeout(() => {
        document.getElementById('checkout-grid').style.display = 'none';
        document.getElementById('success-page').style.display = 'block';
        document.querySelector('.close-btn').style.display = 'none';
        document.getElementById('res-id').innerText = "ORD-" + Math.floor(1000 + Math.random() * 9000);
    }, 1200);
}

// FUNGSI EXCEL DENGAN PASSWORD & RAPI (SEMICOLON FORMAT)
function downloadExcel() {
    const PASS_BENAR = "admin123"; // Password lu di sini
    const inputPass = prompt("Masukkan Password Admin:");

    if (inputPass !== PASS_BENAR) {
        alert("Akses Ditolak!");
        return;
    }

    if (semuaPesanan.length === 0) {
        alert("Belum ada pesanan!");
        return;
    }

    // Pakai BOM \uFEFF agar Excel membaca UTF-8 dengan benar
    let csvContent = "\uFEFF"; 
    // Header Kolom (Gunakan ; agar otomatis jadi kolom di Excel Indonesia)
    csvContent += "Waktu;Nama Pelanggan;Alamat;Daftar Barang;Total Harga\n";

    semuaPesanan.forEach(p => {
        // Hilangkan karakter ; atau , dari alamat agar tidak merusak kolom
        let alamatBersih = p.Alamat.replace(/[;,]/g, ' ');
        let baris = `${p.Waktu};${p.Nama};${alamatBersih};${p.Pesanan};${p.Total}`;
        csvContent += baris + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "rekap_penjualan.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function selesaiBelanja() {
    keranjang = [];
    totalHarga = 0;
    document.getElementById('count').innerText = "0";
    document.getElementById('form-pesanan').reset();
    tutupModal();

    setTimeout(() => {
        document.getElementById('checkout-grid').style.display = 'grid';
        document.getElementById('success-page').style.display = 'none';
        document.querySelector('.close-btn').style.display = 'block';
        const btn = document.querySelector('.btn-final');
        btn.innerHTML = 'Konfirmasi & Pesan';
        btn.disabled = false;
    }, 500);
}