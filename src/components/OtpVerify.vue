<script lang="ts" setup>
import {ref, onMounted, inject} from 'vue'

const otpProps = defineProps({
  length: {
    type: Number,
    default: 4
  }
})

const otp = ref(new Array(otpProps.length).fill(''))
const container = ref()
const otpError = ref('')
const emit = defineEmits(['entered', 'token'])
const setLoading = inject('setLoading') as (value: boolean) => void

onMounted(() => {
  otp.value.fill('')
})

function handleEnter(e: KeyboardEvent, i: number) {
  const children = container.value.children
  const keyPressed = e.key

  if (i > 0 &&(keyPressed === 'Backspace' || keyPressed === 'Delete')) {
    if (otp.value[i] != null && i == otpProps.length - 1) {
      otp.value[i] = null
      return
    }
    otp.value[i] = null
    children[i - 1].focus()
    return
  } else {
    const matched = keyPressed.match(/^[0-9]$/)
    if (!matched) {
      if (i < otpProps.length - 1 || otp.value[i] === null) {
        otp.value[i] = null;
      }
    } else {
      otp.value[i] = e.key;
      if (i < otpProps.length - 1) {
        children[i + 1].focus();
      }
    }
    checkOTP()
  }
}

function checkOTP() {
  let isComplete  = otp.value.every(val => val !== null && val !== '')

  if (isComplete) {
    setLoading(true)
    emit('entered', otp.value.join(''))
    verifyOTP(otp.value.join('')).then(isValid => {
      if (isValid) {
        otpError.value = ''
      } else {
        setLoading(false)
        otpError.value = 'Invalid OTP code. Please try again.'
        otp.value.fill(null)
        container.value.children[0].focus();
      }
    })
  }
}

async function verifyOTP(code: string) {
  try {
    const response = await fetch('/api/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code })
    });

    const data = await response.json();

    if (data.valid) {
      emit('token', data.token);
      return data.valid
    } else {
      otpError.value = 'Invalid OTP code. Please try again.';
    }
  } catch (error) {
    console.error("Error verifying OTP", error);
    otpError.value = 'An error occurred while verifying. Please try again.';
  }
}


function handlePaste(event: ClipboardEvent) {
  const clipboardData = event.clipboardData
  const pastedData = clipboardData?.getData('Text').trim()

  if (pastedData != null && pastedData.length === otpProps.length && /^\d+$/.test(pastedData)) {
    pastedData.split('').forEach((digit, index) => {
      otp.value[index] = digit
      container.value.children[index].focus()
    })

    checkOTP()
  }
}

</script>

<template>
  <form>
    <div class="otp-container">
      <h3 class="otp-title">Enter verification</h3>
      <div ref="container" class="input-group">
        <input v-for="n in length" :key="n" @keyup="(e) => handleEnter(e, n-1)" @paste="handlePaste" v-model="otp[n-1]"
               class="input" type="text" maxlength="1" :autofocus="n === 1">
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

.no-pointer-events {
  pointer-events: none;
}

.error-message {
  color: red;
  margin-top: 1rem;
}
</style>