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
        Schema::create('transaksi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('userId')->unique()->constrained('users');
            $table->foreignId("orderId")->unique()->constrained('order');
            $table->foreignId("produkId")->unique()->constrained('produk');
            $table->foreignId("ongkirId")->unique()->constrained('ongkir');
            $table->enum("status", ["belum", "bayar", "tolak"])->default("belum");
            $table->string("code");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksi');
    }
};
