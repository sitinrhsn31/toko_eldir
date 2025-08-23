<?php

namespace App\Http\Controllers;

use App\Models\Produk;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage; // Import Storage facade

class ProdukController extends Controller
{
    /**
     * Tampilkan daftar sumber daya.
     */
    public function index()
    {
        $produks = Produk::with('category')->paginate(10);
        $categoriesList = Category::all();

        // Menambahkan console.log untuk debugging data yang dikirim ke frontend
        // Gunakan dd() untuk melihat data secara langsung di browser jika perlu
        // dd($produks, $categoriesList);

        return Inertia::render('produk/index', [
            'produks' => $produks,
            'categoriesList' => $categoriesList,
        ]);
    }

    /**
     * Tampilkan formulir untuk membuat sumber daya baru.
     */
    public function create()
    {
        return view('produk.create');
    }

    /**
     * Simpan sumber daya yang baru dibuat di penyimpanan.
     */
    public function store(Request $request)
    {
        // Mendapatkan data dari request
        $data = $request->all();

        // Aturan validasi yang diperbarui
        $validatedData = $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'harga' => 'required|numeric',
            'stok' => 'required|integer',
            'ukuran' => 'required|array',
            'ukuran.*' => 'in:S,M,L,XL',
            'foto' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'categoryId' => 'required|exists:category,id',
        ]);

        // Simpan file foto ke direktori 'public/images/produk'
        $path = $request->file('foto')->store('images/produk', 'public');

        $produk = new Produk($validatedData);
        $produk->foto = $path;
        $produk->save();

        return redirect()->route('produk.index')
                         ->with('success', 'Produk berhasil ditambahkan.');
    }

    /**
     * Tampilkan sumber daya yang ditentukan.
     */
    public function show(Produk $produk)
    {
        return view('produk.show', compact('produk'));
    }

    /**
     * Tampilkan formulir untuk mengedit sumber daya yang ditentukan.
     */
    public function edit(Produk $produk)
    {
        return view('produk.edit', compact('produk'));
    }

    /**
     * Perbarui sumber daya yang ditentukan di penyimpanan.
     */
    public function update(Request $request, Produk $produk)
    {
        // dd($request->all(), $request->hasFile('foto')); // Debug untuk melihat data request

        $validatedData = $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'harga' => 'required|numeric',
            'stok' => 'required|integer',
            'ukuran' => 'required|array',
            'ukuran.*' => 'in:S,M,L,XL',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'categoryId' => 'required|exists:category,id',
        ]);

        // Cek jika ada file foto baru
        if ($request->hasFile('foto')) {
            // Hapus foto lama jika ada
            if ($produk->foto) {
                Storage::disk('public')->delete($produk->foto);
            }
            // Simpan foto baru
            $path = $request->file('foto')->store('images/produk', 'public');
            $validatedData['foto'] = $path;
        }

        $produk->update($validatedData);

        return redirect()->route('produk.index')
                         ->with('success', 'Produk berhasil diperbarui.');
    }

    /**
     * Hapus sumber daya yang ditentukan dari penyimpanan.
     */
    public function destroy(Produk $produk)
    {
        // Hapus foto dari storage
        if ($produk->foto) {
            Storage::disk('public')->delete($produk->foto);
        }
        $produk->delete();

        return redirect()->route('produk.index')
                         ->with('success', 'Produk berhasil dihapus.');
    }
}
