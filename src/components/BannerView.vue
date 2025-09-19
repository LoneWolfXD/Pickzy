<template>
  <div class="carousel">
    <div
      class="carousel-track"
      :style="{
        transform: `translateX(-${currentSlide * 100}%)`,
        transition: isTransitioning ? 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
      }"
      @transitionend="handleTransitionEnd"
    >
      <!-- clone of last -->
      <div class="slide">
        <div class="slide-content">
          <img src="../assets/slide4.jpg" alt="Banner 4" />
          <div class="slide-overlay">
            <div class="slide-text">
              <h2 class="slide-title">Fresh Groceries</h2>
              <p class="slide-subtitle">Delivered in 10 minutes</p>
              <button class="slide-cta">Shop Now</button>
            </div>
          </div>
        </div>
      </div>

      <!-- real slides -->
      <div class="slide">
        <div class="slide-content">
          <img src="../assets/slide1.jpg" alt="Banner 1" />
          <div class="slide-overlay">
            <div class="slide-text">
              <h2 class="slide-title">Fresh Vegetables</h2>
              <p class="slide-subtitle">Farm to your doorstep</p>
              <button class="slide-cta">Order Now</button>
            </div>
          </div>
        </div>
      </div>
      <div class="slide">
        <div class="slide-content">
          <img src="https://images.pexels.com/photos/4113665/pexels-photo-4113665.jpeg" alt="Banner 2" />
          <div class="slide-overlay">
            <div class="slide-text">
              <h2 class="slide-title">Daily Essentials</h2>
              <p class="slide-subtitle">Everything you need, delivered fast</p>
              <button class="slide-cta">Explore</button>
            </div>
          </div>
        </div>
      </div>
      <div class="slide">
        <div class="slide-content">
          <img src="../assets/slide3.jpg" alt="Banner 3" />
          <div class="slide-overlay">
            <div class="slide-text">
              <h2 class="slide-title">Premium Quality</h2>
              <p class="slide-subtitle">Best prices guaranteed</p>
              <button class="slide-cta">Shop Now</button>
            </div>
          </div>
        </div>
      </div>
      <div class="slide">
        <div class="slide-content">
          <img src="../assets/slide4.jpg" alt="Banner 4" />
          <div class="slide-overlay">
            <div class="slide-text">
              <h2 class="slide-title">Fresh Groceries</h2>
              <p class="slide-subtitle">Delivered in 10 minutes</p>
              <button class="slide-cta">Shop Now</button>
            </div>
          </div>
        </div>
      </div>

      <!-- clone of first -->
      <div class="slide">
        <div class="slide-content">
          <img src="../assets/slide1.jpg" alt="Banner 1" />
          <div class="slide-overlay">
            <div class="slide-text">
              <h2 class="slide-title">Fresh Vegetables</h2>
              <p class="slide-subtitle">Farm to your doorstep</p>
              <button class="slide-cta">Order Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Controls -->
    <button class="control prev" @click="prevSlide" aria-label="Previous slide">
      <i class="ri-arrow-left-s-line"></i>
    </button>
    <button class="control next" @click="nextSlide" aria-label="Next slide">
      <i class="ri-arrow-right-s-line"></i>
    </button>

    <!-- Dots Indicator -->
    <div class="dots-container">
      <button 
        v-for="n in totalSlides" 
        :key="n"
        class="dot"
        :class="{ active: currentSlide === n }"
        @click="goToSlide(n)"
        :aria-label="`Go to slide ${n}`"
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const currentSlide = ref<number>(1);
const totalSlides = ref<number>(4);
const isTransitioning = ref<boolean>(true);
let autoSlideInterval: NodeJS.Timeout | null = null;

const nextSlide = (): void => {
  isTransitioning.value = true;
  currentSlide.value++;
};

const prevSlide = (): void => {
  isTransitioning.value = true;
  currentSlide.value--;
};

const goToSlide = (slideNumber: number): void => {
  isTransitioning.value = true;
  currentSlide.value = slideNumber;
};

const handleTransitionEnd = (): void => {
  if (currentSlide.value === totalSlides.value + 1) {
    isTransitioning.value = false;
    currentSlide.value = 1;
  }
  if (currentSlide.value === 0) {
    isTransitioning.value = false;
    currentSlide.value = totalSlides.value;
  }
};

const startAutoSlide = () => {
  autoSlideInterval = setInterval(() => {
    nextSlide();
  }, 5000);
};

const stopAutoSlide = () => {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval);
    autoSlideInterval = null;
  }
};

onMounted(() => {
  startAutoSlide();
});

onUnmounted(() => {
  stopAutoSlide();
});
</script>

<style scoped>
.carousel {
  position: relative;
  width: 100%;
  height: 60vh;
  overflow: hidden;
  border-radius: 16px;
  margin: 20px auto;
  max-width: 1200px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .carousel {
    height: 40vh;
    margin: 10px;
    border-radius: 12px;
  }
}

.carousel-track {
  display: flex;
  width: 100%;
  height: 100%;
}

.slide {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  position: relative;
}

.slide-content {
  position: relative;
  width: 100%;
  height: 100%;
}

.slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 60px;
}

@media (max-width: 768px) {
  .slide-overlay {
    padding: 0 20px;
    justify-content: center;
    text-align: center;
  }
}

.slide-text {
  color: white;
  max-width: 500px;
}

.slide-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 16px;
  line-height: 1.1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .slide-title {
    font-size: 2rem;
    margin-bottom: 12px;
  }
}

.slide-subtitle {
  font-size: 1.25rem;
  margin-bottom: 24px;
  opacity: 0.95;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .slide-subtitle {
    font-size: 1rem;
    margin-bottom: 20px;
  }
}

.slide-cta {
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  color: white;
  border: none;
  padding: 14px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(22, 163, 74, 0.3);
}

.slide-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(22, 163, 74, 0.4);
  background: linear-gradient(135deg, #15803d 0%, #166534 100%);
}

@media (max-width: 768px) {
  .slide-cta {
    padding: 12px 24px;
    font-size: 1rem;
  }
}

.control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  color: #374151;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.control:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.control.prev {
  left: 20px;
}

.control.next {
  right: 20px;
}

@media (max-width: 768px) {
  .control {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  .control.prev {
    left: 10px;
  }
  
  .control.next {
    right: 10px;
  }
}

.dots-container {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 10;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: white;
  border-color: white;
  transform: scale(1.2);
}

.dot:hover {
  border-color: rgba(255, 255, 255, 0.8);
}

@media (max-width: 768px) {
  .dots-container {
    bottom: 15px;
    gap: 8px;
  }
  
  .dot {
    width: 10px;
    height: 10px;
  }
}
</style>