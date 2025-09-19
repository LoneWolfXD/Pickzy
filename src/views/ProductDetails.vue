<template>
  <Header />
  
  <LoadingSpinner 
    v-if="loading" 
    text="Loading product details..." 
    size="lg"
    fullScreen
  />
  
  <div v-else-if="error" class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
      <button @click="$router.go(-1)" class="bg-green-600 text-white px-6 py-2 rounded-lg">
        Go Back
      </button>
    </div>
  </div>
  
  <div v-else class="min-h-screen bg-gray-50">
    <!-- Breadcrumb -->
    <div class="bg-white border-b">
      <div class="max-w-7xl mx-auto px-4 py-3">
        <nav class="flex items-center space-x-2 text-sm text-gray-600">
          <RouterLink to="/" class="hover:text-green-600">Home</RouterLink>
          <i class="ri-arrow-right-s-line"></i>
          <span class="text-gray-800">{{ product?.name }}</span>
        </nav>
      </div>
    </div>

    <!-- Product Details -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          <!-- Product Image -->
          <div class="space-y-4">
            <div class="aspect-square bg-gray-100 rounded-xl overflow-hidden">
              <img 
                v-if="product?.image" 
                :src="product.image" 
                :alt="product.name"
                class="w-full h-full object-contain"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <i class="ri-image-line text-6xl"></i>
              </div>
            </div>
          </div>

          <!-- Product Info -->
          <div class="space-y-6">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                  ⏱ 8 MINS
                </span>
                <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                  Fresh
                </span>
              </div>
              
              <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ product?.name }}</h1>
              <p v-if="product?.weight" class="text-gray-600 mb-4">{{ product.weight }}</p>
              
              <div class="flex items-center gap-4 mb-6">
                <span class="text-3xl font-bold text-green-600">{{ priceDisplay }}</span>
                <span class="text-lg text-gray-500 line-through">₹{{ (priceNumber * 1.2).toFixed(2) }}</span>
                <span class="bg-red-100 text-red-800 text-sm font-semibold px-2 py-1 rounded">
                  17% OFF
                </span>
              </div>
            </div>

            <!-- Quantity Selector -->
            <div class="space-y-4">
              <h3 class="font-semibold text-gray-900">Quantity</h3>
              <div class="flex items-center gap-4">
                <div v-if="inCartQty > 0" class="flex items-center bg-green-600 text-white rounded-lg">
                  <button @click="decrementQty" class="px-4 py-2 hover:bg-green-700 rounded-l-lg">−</button>
                  <span class="px-4 py-2 bg-green-600">{{ inCartQty }}</span>
                  <button @click="incrementQty" class="px-4 py-2 hover:bg-green-700 rounded-r-lg">+</button>
                </div>
                
                <button
                  v-else
                  @click="addToCart"
                  class="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>

            <!-- Product Features -->
            <div class="space-y-4">
              <h3 class="font-semibold text-gray-900">Why choose this product?</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <i class="ri-truck-line text-green-600 text-xl"></i>
                  <span class="text-sm text-gray-700">Fast Delivery</span>
                </div>
                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <i class="ri-leaf-line text-green-600 text-xl"></i>
                  <span class="text-sm text-gray-700">Fresh & Organic</span>
                </div>
                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <i class="ri-shield-check-line text-green-600 text-xl"></i>
                  <span class="text-sm text-gray-700">Quality Assured</span>
                </div>
                <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <i class="ri-money-dollar-circle-line text-green-600 text-xl"></i>
                  <span class="text-sm text-gray-700">Best Price</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Suggested Products -->
      <div class="mt-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
        
        <LoadingSpinner 
          v-if="suggestedLoading" 
          text="Loading suggestions..." 
          size="md"
        />
        
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <ProductCard
            v-for="suggestedProduct in suggestedProducts"
            :key="suggestedProduct.id"
            :products="suggestedProduct"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Popup Notification -->
  <div
    ref="popup"
    class="fixed bottom-6 right-6 bg-black shadow-xl rounded-xl px-6 py-4 text-md text-white font-bold opacity-0 pointer-events-none z-50"
  >
    ✅ Item added to cart!
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCart } from '@/stores/cart'
import { useProductStore } from '@/stores/products'
import Header from '@/components/Header.vue'
import ProductCard from '@/components/ProductCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import type { ICard } from '@/models/Card'
import gsap from 'gsap'

const route = useRoute()
const router = useRouter()
const cart = useCart()
const productStore = useProductStore()

const product = ref<ICard | null>(null)
const suggestedProducts = ref<ICard[]>([])
const loading = ref(true)
const suggestedLoading = ref(true)
const error = ref(false)
const popup = ref<HTMLElement | null>(null)

const productId = route.params.id as string

// Computed properties
const priceNumber = computed(() => {
  if (!product.value?.price) return 0
  const price = product.value.price
  if (typeof price === 'number') return price
  if (typeof price === 'string') {
    const cleaned = price.replace(/[^\d.,-]/g, '').replace(/,/g, '.')
    const n = Number(cleaned)
    return Number.isFinite(n) ? n : 0
  }
  return 0
})

const priceDisplay = computed(() =>
  priceNumber.value > 0 ? `₹${priceNumber.value.toFixed(2)}` : '—'
)

const inCartQty = computed(() => {
  if (!product.value) return 0
  const item = cart.cartItems.find((i) => i.id === product.value!.id)
  return item ? item.qty : 0
})

// Methods
function incrementQty() {
  if (product.value) {
    cart.incrementQuantity(product.value.id)
  }
}

function decrementQty() {
  if (product.value) {
    cart.decrementQuantity(product.value.id)
  }
}

function addToCart() {
  if (!product.value) return
  
  cart.addItem(
    {
      id: product.value.id,
      name: product.value.name ?? 'Unnamed',
      price: priceNumber.value,
      image: product.value.image,
      weight: product.value.weight,
    },
    1
  )
  
  showPopup('Product added to cart!')
}

function showPopup(message: string) {
  if (!popup.value) return

  popup.value.innerText = message

  gsap.fromTo(
    popup.value,
    { y: 50, opacity: 0, pointerEvents: 'none' },
    { y: 0, opacity: 1, pointerEvents: 'auto', duration: 0.5, ease: 'power3.out' }
  )

  setTimeout(() => {
    gsap.to(popup.value, {
      y: 50,
      opacity: 0,
      pointerEvents: 'none',
      duration: 0.5,
      ease: 'power3.in',
    })
  }, 2500)
}

// Load product data
onMounted(async () => {
  try {
    await productStore.fetchProductList()
    
    // Find the product by ID
    const allProducts = productStore.productList.categories.flatMap(category => category.products ?? [])
    product.value = allProducts.find(p => p.id === productId) || null
    
    if (!product.value) {
      error.value = true
      return
    }
    
    // Find suggested products from the same category
    const currentCategory = productStore.productList.categories.find(category => 
      category.products?.some(p => p.id === productId)
    )
    
    if (currentCategory?.products) {
      suggestedProducts.value = currentCategory.products
        .filter(p => p.id !== productId)
        .slice(0, 10)
    }
    
  } catch (err) {
    error.value = true
  } finally {
    loading.value = false
    suggestedLoading.value = false
  }
})
</script>