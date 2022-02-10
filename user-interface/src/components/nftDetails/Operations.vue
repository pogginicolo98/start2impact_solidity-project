<template>
  <div class="operations">
    <div class="row">

      <!-- Price area -->
      <div class="col-12">
        <div class="card card-nft"
             style="width: 100%; height: auto;">
             <div class="card-body p-4">
               <p class="text-secondary">Selling price</p>
                 <VueCustomTooltip label="$WISP">
                   <div class="token-logo-wrapper position-relative d-inline-block">
                     <img alt="$WISP"
                          src="@/assets/images/token-logo-32x32.png">
                   </div>
                 </VueCustomTooltip>
                 <span class="fw-bold fs-3 align-middle"> 1200.6</span>
             </div>
        </div>
      </div> <!-- Price area -->

    </div>
  </div> <!-- Operations -->
</template>

<script>
  export default {
    name: "OperationsComponent",

    props: {
      isLoading: {
        type: Boolean,
        required: true
      },
      nft: {
        type: Object,
        required: false
      },
    },
  }
</script>

<style scoped>
  .token-logo-wrapper {
    width: 33px;
    height: 33px;
    border: none;
    border-radius: 100%;
    background-color: rgba(255, 255, 255, 0.6);
  }
</style>
