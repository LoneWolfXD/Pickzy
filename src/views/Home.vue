<script setup lang="ts">
import Categories from '../components/Categories.vue';
import Products from '@/components/Products.vue';
import Header from '@/components/Header.vue';
import BannerView from '@/components/BannerView.vue';

</script>

<template>
    <Header/>
    <BannerView/>
    <div class="max-w-7xl mx-auto px-4">
      <Categories/>
      <div class="my-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Popular Products</h2>
        <Products/>
      </div>
    </div>
</template>

