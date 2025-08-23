<?php

namespace App\Http\Controllers;

use App\Models\Ongkir;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OngkirController extends Controller
{
    /**
     * Tampilkan daftar sumber daya.
     */
    public function index()
    {
        $ongkirs = Ongkir::paginate(10);
        return Inertia::render('ongkir/index', [
            'ongkirs' => $ongkirs,
        ]);
    }

    /**
     * Tampilkan formulir untuk membuat sumber daya baru.
     */
    public function create()
    {
        return view('ongkir.create');
    }

    /**
     * Simpan sumber daya yang baru dibuat di penyimpanan.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'biaya' => 'required|numeric',
        ]);

        Ongkir::create($validatedData);

        return redirect()->route('ongkir.index')
                         ->with('success', 'Data ongkir berhasil ditambahkan.');
    }

    /**
     * Tampilkan sumber daya yang ditentukan.
     */
    public function show(Ongkir $ongkir)
    {
        return view('ongkir.show', compact('ongkir'));
    }

    /**
     * Tampilkan formulir untuk mengedit sumber daya yang ditentukan.
     */
    public function edit(Ongkir $ongkir)
    {
        return view('ongkir.edit', compact('ongkir'));
    }

    /**
     * Perbarui sumber daya yang ditentukan di penyimpanan.
     */
    public function update(Request $request, Ongkir $ongkir)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'biaya' => 'required|numeric',
        ]);

        $ongkir->update($validatedData);

        return redirect()->route('ongkir.index')
                         ->with('success', 'Data ongkir berhasil diperbarui.');
    }

    /**
     * Hapus sumber daya yang ditentukan dari penyimpanan.
     */
    public function destroy(Ongkir $ongkir)
    {
        $ongkir->delete();

        return redirect()->route('ongkir.index')
                         ->with('success', 'Data ongkir berhasil dihapus.');
    }
}
