<template>
  <div class="flex justify-center items-center" :class="containerClass">
    <div class="relative">
      <!-- Main spinner -->
      <div 
        class="animate-spin rounded-full border-4 border-green-200 border-t-green-600"
        :class="spinnerClass"
      ></div>
      
      <!-- Inner dot -->
      <div 
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-600 rounded-full animate-pulse"
        :class="dotClass"
      ></div>
    </div>
    
    <!-- Loading text -->
    <div v-if="showText" class="ml-3">
      <p class="text-gray-600 font-medium">{{ text }}</p>
      <p v-if="subText" class="text-gray-400 text-sm">{{ subText }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  subText?: string
  showText?: boolean
  fullScreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  text: 'Loading...',
  showText: true,
  fullScreen: false
})

const containerClass = computed(() => {
  if (props.fullScreen) {
    return 'min-h-screen'
  }
  return 'h-64'
})

const spinnerClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'h-6 w-6'
    case 'md': return 'h-12 w-12'
    case 'lg': return 'h-16 w-16'
    case 'xl': return 'h-24 w-24'
    default: return 'h-12 w-12'
  }
})

const dotClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'h-1 w-1'
    case 'md': return 'h-2 w-2'
    case 'lg': return 'h-3 w-3'
    case 'xl': return 'h-4 w-4'
    default: return 'h-2 w-2'
  }
})
</script>