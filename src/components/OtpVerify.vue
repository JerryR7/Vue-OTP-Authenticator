<script lang="ts" setup>
import {ref, onMounted, inject} from 'vue'

const otpProps = defineProps({
  length: {type: Number, default: 4}
})

const otp = ref(new Array(otpProps.length).fill(''))
const container = ref()
const otpError = ref('')
const emit = defineEmits(['entered', 'token'])
const setLoading = inject('setLoading') as (value: boolean) => void

onMounted(() => {
  otp.value.fill('')
})

function validateInput(index: number) {
  if (!/^[0-9]$/.test(otp.value[index])) {
    otp.value[index] = ''
  }
}

function handleEnter(e: KeyboardEvent, i: number) {
  isBackspaceOrDelete(e) ? handleBackspaceOrDelete(i) : handleRegularInput(e, i)
}

function isBackspaceOrDelete(e: KeyboardEvent): boolean {
  return e.key === 'Backspace' || e.key === 'Delete'
}

function handleBackspaceOrDelete(i: number) {
  if (i == otpProps.length - 1 && otp.value[i] != null) {
    otp.value[i] = null
  } else {
    otp.value[i] = null
    container.value.children[i - 1]?.focus()
  }
}

function handleRegularInput(e: KeyboardEvent, i: number) {
  if (/^[0-9]$/.test(e.key)) {
    otp.value[i] = e.key
    if (i < otpProps.length - 1) {
      container.value.children[i + 1].focus()
    }
  } else {
    otp.value[i] = ''
  }
  checkOTP()
}

function checkOTP() {
  let isComplete = otp.value.every(val => val !== null && val != '')

  if (isComplete) {
    setLoading(true)
    emit('entered', otp.value.join(''))
    verifyOTP(otp.value.join(''))
  }
}

async function verifyOTP(code: string) {
  try {
    const response = await fetch('/api/verify', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({code})
    })

    if (!response.ok) otpError.value = 'Server response not OK'

    const data = await response.json()
    if (data.valid) {
      emit('token', data.token)
    } else {
      otpError.value = 'Invalid OTP code. Please try again.'
      otp.value.fill('')
      container.value.children[0].focus()
    }
  } catch (error) {
    console.error("Error verifying OTP", error)
    otpError.value = 'An error occurred while verifying. Please try again.'
  } finally {
    setLoading(false)
  }
}

function handlePaste(event: ClipboardEvent) {
  const clipboardData = event.clipboardData
  const pastedData = clipboardData?.getData('Text').trim()

  if (pastedData && pastedData.length === otpProps.length && /^\d+$/.test(pastedData)) {
    otp.value = pastedData.split('')
    container.value.children[otpProps.length - 1].focus()
    checkOTP()
  }
}

</script>

<template>
  <form>
    <div class="otp-container">
      <h3 class="otp-title">Enter verification</h3>
      <div ref="container" class="input-group">
        <input
            v-for="n in length"
            :key="n"
            @keyup="(e) => handleEnter(e, n-1)"
            @paste="handlePaste"
            @input="validateInput(n-1)"
            v-model="otp[n-1]"
            class="input"
            type="text"
            maxlength="1"
            :autofocus="n === 1">
      </div>
      <div v-if="otpError" class="error-message">{{ otpError }}</div>
    </div>
  </form>
</template>
<style scoped>
.otp-container {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
}

.otp-title {
  font-size: 2rem;
}

.input-group {
  display: flex;
  gap: 1rem;
}

.input-group > .input {
  width: 8rem;
  height: 12rem;
  text-align: center;
  font-size: 2rem;
}

.error-message {
  color: red;
  margin-top: 1rem;
}
</style>