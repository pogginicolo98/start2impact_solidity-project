<template>
  <div class="footerComponent"
       :class="{ 'footer-fixed': isFixedFooter }">
       <nav class="navbar navbar-light">
         <div class="row justify-content-center">
           <div class="col">
             <a class="link-icon fs-24px"
                href="https://github.com/pogginicolo98/start2impact_solidity-project"
                ><i class="fa-brands fa-github"></i>
             </a>
           </div>
           <div class="col">
             <a class="link-icon fs-24px mx-5"
                href="https://www.linkedin.com/in/nicol%C3%B2-poggi-481227157/"
                ><i class="fa-brands fa-linkedin-in"></i>
             </a>
           </div>
           <div class="col">
             <a class="link-icon fs-24px"
                href="https://talent.start2impact.it/profile/nicolo-poggi"
                ><i class="fa-solid fa-rocket"></i>
             </a>
           </div>
         </div>
       </nav>
  </div>
</template>

<script>
  export default {
    name: "FooterComponent",

    props: {
      isFixedFooter: {
        type: Boolean,
        default: false,
      },
    },
  }
</script>

<style scoped>
  .fs-24px {
    font-size: 24px;
  }

  .footerComponent {
    display: flex;
    justify-content: center;
    border-top: 1px solid hsla(0,0%,100%,.2);
    background: transparent;
    width: 100%;
    z-index: 1;
  }

  .footer-fixed {
    position: fixed;
    bottom: 0;
    left: 0;
  }

  .link-icon {
    color: #FFF;
    opacity: 0.6;
  }

  .link-icon:hover {
    opacity: 1;
  }
</style>
