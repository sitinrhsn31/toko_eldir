<?php

namespace Database\Seeders;

use App\Models\Ongkir;
use Illuminate\Database\Seeder;

class OngkirSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Ongkir::factory()->create([
            'name' => 'JNE',
            'biaya' => '10000',
        ]);
        Ongkir::factory()->create([
            'name' => 'JNT',
            'biaya' => '50000',
        ]);
        Ongkir::factory()->create([
            'name' => 'Fedex',
            'biaya' => '90000',
        ]);
    }
}
