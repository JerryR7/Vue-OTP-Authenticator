<script setup lang="ts">
import OtpVerify from '@/components/OtpVerify.vue'
import Profile from '@/components/Profile.vue'
import {ref, onMounted, provide} from 'vue'

const isAuthenticated = ref(false)

const isLoading = ref(true);

onMounted(() => {
  checkAuthentication();
});

const checkAuthentication = () => {
  const token = localStorage.getItem('token');
  isAuthenticated.value = !!token;
  isLoading.value = false;
};

const handleAuthentication = (token: string) => {
  localStorage.setItem('token', token);
  isAuthenticated.value = true;
};

const handleLogout = () => {
  localStorage.removeItem('token');
  isAuthenticated.value = false;
};

const setLoading = (value: boolean) => {

  isLoading.value = value;
}

provide('logout', handleLogout)
provide('setLoading', setLoading)

</script>

<template>
  <div v-if="isLoading" class="loading-overlay">
    <div class="loading-message">Loading...</div>
  </div>
  <Profile v-if="isAuthenticated" @logout="handleLogout" />
  <OtpVerify v-else @token="handleAuthentication" />
</template>

<style>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-message {
  color: white;
  font-size: 2rem;
}
</style>