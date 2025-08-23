<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order', function (Blueprint $table) {
            $table->id();
            $table->foreignId('userId')->unique()->constrained('users');
            $table->foreignId("produkId")->unique()->constrained('produk');
            $table->foreignId("cartId")->unique()->constrained('cart');
            $table->foreignId("ongkirId")->unique()->constrained('ongkir');
            $table->string('name');
            $table->integer('nohp');
            $table->text("alamat");
            $table->float("totalHarga");
            $table->enum("status", ["belum", "proses", "kirim", "selesai"])->default("belum");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order');
    }
};
