<script setup>
</script>

<template>
  1
  <router-view></router-view>
</template>

<script setup>
import { ceshi } from '@/api/Index'
ceshi().then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
})
</script>