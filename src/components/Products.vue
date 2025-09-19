<script setup lang="ts">
import type { ICategorycard } from '@/models/Categorycard'
import { useProductStore } from '@/stores/products'
import { ref, onMounted, watch } from 'vue'
import ProductCard from './ProductCard.vue'
import filter from '@/composables/filter.ts'
const {filterCategory} = filter()
import LoadingSpinner from './LoadingSpinner.vue'
import type { ICard } from '@/models/Card'
const Productstore = useProductStore()
const Category = ref<ICategorycard[]>([])
const allProducts = ref<ICard[]>([])
const props = defineProps<{ selectedCategory?: string }>()
watch(
  () => props.selectedCategory, // getter so Vue tracks reactivity
  () => {
    const filterProducts = Category.value.filter((eachCategory: ICategorycard) => {
      if (props.selectedCategory === 'Sweet Tooth') {
        return eachCategory.name === 'Chocolates & Candies' || eachCategory.name === 'Indian Mithai'
      } else {
        return eachCategory.name === props.selectedCategory
      }
    })
    allProducts.value = filterProducts.flatMap((category) => category.products ?? [])
  },
)
watch(filterCategory,()=>{
  const cartProducts = Category.value.flatMap((category) => category.products ?? [])
  const query = filterCategory.value.trim().toLowerCase()
  const filterhomeProducts = cartProducts.filter(eachcategory =>
  !query || eachcategory.name?.toLowerCase().includes(query)
)
  allProducts.value = filterhomeProducts
  
})
onMounted(async () => {
  await Productstore.fetchProductList()
  Category.value = Productstore.productList.categories

  if (props.selectedCategory) {
    const filterProducts = Category.value.filter((eachCategory: ICategorycard) => {
      if (props.selectedCategory === 'Sweet Tooth') {
        return eachCategory.name === 'Chocolates & Candies' || eachCategory.name === 'Indian Mithai'
      } else {
        return eachCategory.name === props.selectedCategory
      }
    })
    allProducts.value = filterProducts.flatMap((category) => category.products ?? [])
  } else {
    const cartProducts = Category.value.flatMap((category) => category.products ?? [])
    allProducts.value = cartProducts.slice(0, 30)
  }
 
})
const loading = ref(true);
</script>

<template>
  <LoadingSpinner 
    v-if="Productstore.loading" 
    text="Loading fresh products..." 
    subText="Getting the best deals for you"
    size="lg"
  />
  <div v-else-if="Productstore.error">{{ Productstore.error }}</div>
  <div class="container mx-auto px-4 md:px-8 lg:px-16">

    <div class="grid gap-4 md:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">

      <ProductCard
        v-for="eachProductcard in allProducts"
        :key="eachProductcard.id"
        :products="eachProductcard"
      />
    </div>
  </div>
</template>

