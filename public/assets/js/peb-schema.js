'use strict';
window.PebSchema = (() => {
    const fields = (text, type = 'text') => text.split('|').map(label => ({ label, type }));
    const sections = [
        { key: 'header', title: 'Header', fields: [...fields('Nomor aju|Nomor invoice|Kategori ekspor|Jenis ekspor|Kantor pabean muat asal|Kantor pabean muat ekspor|Cara dagang|Cara bayar|Komoditi|Curah|Alamat PKB|Nama PIC|Telepon PIC|Jenis barang|Tempat simpan|Cara stuffing|Hal part of'), ...fields('Tanggal PKB', 'date'), ...fields('Jumlah peti kemas 20 feet|Jumlah peti kemas 40 feet', 'number')] },
        { key: 'entities', title: 'Entitas', fields: fields('Jenis identitas eksportir|Nomor identitas eksportir|Nama eksportir|Status eksportir|Alamat eksportir|Nama penerima|Negara penerima|Alamat penerima|Nama pembeli|Negara pembeli|Alamat pembeli|Jenis identitas pemilik|Nomor identitas pemilik|Nama pemilik|Alamat pemilik|Kategori konsolidator|Jenis identitas konsolidator|Nomor identitas konsolidator|NITKU konsolidator|Nama konsolidator|Alamat konsolidator') },
        { key: 'documents', title: 'Dokumen', columns: [...fields('Jenis dokumen|Nomor dokumen'), ...fields('Tanggal dokumen', 'date')] },
        { key: 'transport', title: 'Pengangkut', fields: [...fields('Pelabuhan muat asal|Pelabuhan muat ekspor|Pelabuhan bongkar|Pelabuhan tujuan|Negara tujuan|Lokasi pemeriksaan|Kantor periksa|Nama sarana angkut|Nomor sarana angkut|Cara pengangkutan'), ...fields('Tanggal perkiraan ekspor|Tanggal pemeriksaan', 'date')] },
        { key: 'packaging', title: 'Kemasan', fields: [...fields('Jumlah kemasan', 'number'), ...fields('Jenis kemasan|Merek kemasan')] },
        { key: 'containers', title: 'Peti Kemas', columns: fields('Nomor peti kemas|Ukuran|Jenis|Tipe') },
        { key: 'transaction', title: 'Transaksi', fields: [...fields('Valuta|Cara penyerahan|Kode asuransi|Bank'), ...fields('NDPBM|FOB|Freight|Asuransi|Bruto (kg)|Netto (kg)|Volume (m³)', 'number')] },
        { key: 'goods', title: 'Barang', columns: [...fields('HS|Kode barang|Uraian|Satuan|Kode kemasan|Invoice|Packing list|Order'), ...fields('FOB|Jumlah|Kemasan|Netto (kg)|Volume (m³)|Harga satuan', 'number')] },
        { key: 'declaration', title: 'Pernyataan', fields: [...fields('Nama|Jabatan|Tempat'), ...fields('Tanggal pernyataan', 'date')] }
    ];
    sections.forEach(section => (section.fields || section.columns).forEach((field, i) => { field.key = `${section.key}-${i}`; }));
    return { sections, createEmpty: () => ({ values: {}, documents: [], containers: [], goods: [] }) };
})();
