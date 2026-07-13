<script lang="ts">
import { usePaymentStore } from '../../stores/payments'
import { mapStores } from 'pinia'

export default {
    name: 'OzowBanner',
    props: {
        showBackButton: {
          type: Boolean,
          default: false,
        },
        variant: {
          type: String,
          default: 'default', // 'default' | 'logo'
        },
    },

    computed: {
      ...mapStores(usePaymentStore),
    },

    emits: ['back'],

    methods: {
        onBack() {
          this.$emit('back')
        },

        userCancel() {
          console.log('User cancelled the payment')
          // cancel the payment using the Moneybadger API
          this.paymentsStore.userCancelInvoice()
        },
 
        openHelpModal() {
            this.showingHelp = true
        },

        closeModal() {
            this.showingHelp = false
        },
    },

    data:() => {
        return {
            showingHelp: false,
        }
    }
}
</script>

<template>
  <header class="hero w-[100%]" role="banner" aria-label="Ozow payment header">
    <!-- Row with logo (left) and action buttons (right) -->
    <div class="hero__content px-4">
      <div class="brand" aria-label="Ozow">
       <template v-if="variant === 'logo'">
         <img src="@/assets/partners/ozow/ozow_primary_logo.svg" alt="Ozow" class="brand__primary-logo" />
       </template>
       <template v-else>
         <button v-if="showBackButton" class="btn-circle btn-circle--bordered" aria-label="Back" @click="onBack">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.875 9.375H3.125C2.77982 9.375 2.5 9.65482 2.5 10C2.5 10.3452 2.77982 10.625 3.125 10.625H16.875C17.2202 10.625 17.5 10.3452 17.5 10C17.5 9.65482 17.2202 9.375 16.875 9.375Z" fill="#1E2330"/>
                  <path d="M9.19171 4.81718C9.30892 4.69997 9.375 4.54076 9.375 4.375C9.375 4.20924 9.30915 4.05027 9.19194 3.93306L9.18655 3.92773C9.06983 3.814 8.91296 3.75 8.75 3.75C8.58424 3.75 8.42527 3.81585 8.30806 3.93306L2.68306 9.55806C2.56585 9.67527 2.5 9.83424 2.5 10C2.5 10.1658 2.56585 10.3247 2.68306 10.4419L8.30806 16.0669C8.42527 16.1841 8.58424 16.25 8.75 16.25C8.91576 16.25 9.07473 16.1841 9.19194 16.0669C9.30915 15.9497 9.375 15.7908 9.375 15.625C9.375 15.4592 9.30915 15.3003 9.19194 15.1831L4.00888 10L9.19171 4.81718Z" fill="#1E2330"/>
              </svg>
         </button>
         <!-- Ozow circular logomark -->
         <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.4772 8.02539C22.6578 8.02223 22.8375 8.05482 23.0056 8.12109C23.1736 8.18742 23.3269 8.28642 23.4567 8.41211C25.1927 10.0782 26.3066 12.2883 26.613 14.6748C26.6709 15.1137 26.6989 15.5563 26.697 15.999C26.6959 18.2751 25.958 20.4898 24.5934 22.3115C23.2288 24.1333 21.3108 25.4645 19.1266 26.1055C16.9426 26.7463 14.6098 26.6626 12.4772 25.8672C10.3446 25.0717 8.5264 23.607 7.29559 21.6924L5.34735 23.6396C6.53014 25.3146 8.08621 26.6922 9.89227 27.6631C11.6983 28.6339 13.7051 29.1717 15.7546 29.2344C17.8039 29.297 19.84 28.8831 21.7018 28.0244C23.5638 27.1656 25.2012 25.8857 26.4841 24.2861C26.5975 24.1453 26.7375 24.0281 26.8962 23.9414C27.0548 23.8548 27.2291 23.8006 27.4089 23.7812C27.5886 23.7619 27.7706 23.7781 27.944 23.8291C28.1174 23.8801 28.279 23.9647 28.4196 24.0781C28.5603 24.1913 28.6777 24.3309 28.7643 24.4893C28.851 24.6477 28.9052 24.8224 28.9245 25.002C28.9438 25.1814 28.9276 25.363 28.8766 25.5361C28.8257 25.7094 28.741 25.8712 28.6276 26.0117C27.1323 27.8817 25.2352 29.3912 23.0768 30.4277C20.9185 31.4643 18.5542 32.0011 16.1599 31.999C13.3847 31.9896 10.6589 31.2627 8.24774 29.8887C5.83664 28.5146 3.82168 26.54 2.39911 24.1572C2.24542 23.8952 2.1835 23.5894 2.22235 23.2881C2.26133 22.9865 2.39942 22.7057 2.61493 22.4912L6.68134 18.4268C6.84221 18.266 7.04065 18.1475 7.25848 18.082C7.47635 18.0166 7.7075 18.0062 7.93036 18.0518C8.15329 18.0974 8.36208 18.198 8.5368 18.3438C8.71138 18.4895 8.84657 18.6767 8.93134 18.8877C9.60929 20.5758 10.857 21.9735 12.4577 22.8379C14.0584 23.7023 15.9116 23.9782 17.695 23.6191C19.4783 23.2601 21.0798 22.2885 22.2214 20.8721C23.3629 19.4557 23.9721 17.6842 23.944 15.8652C23.9401 15.5855 23.9211 15.3059 23.8854 15.0283C23.6617 13.2617 22.8382 11.6255 21.5534 10.3926C21.2899 10.1401 21.1375 9.79259 21.1296 9.42773C21.1218 9.06302 21.2591 8.7098 21.5114 8.44629C21.6367 8.31616 21.7863 8.21187 21.9518 8.13965C22.1175 8.06738 22.2965 8.02861 22.4772 8.02539ZM15.1657 11.0156C16.1515 10.8194 17.1736 10.9192 18.1022 11.3037C19.0308 11.6882 19.824 12.3402 20.3825 13.1758C20.941 14.0114 21.2399 14.9939 21.2399 15.999C21.2386 17.346 20.7029 18.6382 19.7507 19.5908C18.7985 20.5434 17.5067 21.0791 16.1599 21.0811C15.1548 21.0815 14.1725 20.7836 13.3366 20.2256C12.5006 19.6675 11.8486 18.8738 11.4636 17.9453C11.0787 17.017 10.9778 15.9955 11.1735 15.0098C11.3693 14.024 11.8528 13.1181 12.5632 12.4072C13.2738 11.6963 14.1799 11.2119 15.1657 11.0156ZM12.8698 5.98438C14.6434 5.40754 16.5378 5.30659 18.363 5.69043C18.6706 5.75577 18.9465 5.92449 19.1442 6.16895C19.3421 6.41368 19.4495 6.71947 19.4489 7.03418C19.4505 7.13332 19.4406 7.23264 19.4177 7.3291C19.3521 7.63739 19.1819 7.91385 18.9362 8.11133C18.6904 8.30887 18.3834 8.41542 18.0681 8.41309C17.9698 8.41326 17.8719 8.40242 17.7761 8.38086C17.248 8.26798 16.7096 8.21063 16.1696 8.20996C14.2334 8.22184 12.3631 8.91698 10.8893 10.1729C10.2112 10.7644 9.5459 11.4553 8.90985 12.126C8.57568 12.475 8.24388 12.8192 7.91962 13.1533L3.05829 18.0049L1.35712 19.7051C1.26844 19.795 1.15713 19.859 1.03485 19.8906C0.912583 19.9222 0.78389 19.9205 0.662781 19.8848C0.54156 19.8489 0.431928 19.7806 0.346375 19.6875C0.260907 19.5945 0.202004 19.4801 0.176453 19.3564C0.11457 19.0347 0.0603297 18.7101 0.0182495 18.3809C-0.0254018 18.0415 0.00965545 17.6966 0.120789 17.373C0.23193 17.0495 0.415965 16.7555 0.658875 16.5146L3.04071 14.1309L5.96161 11.208C6.2833 10.8888 6.59994 10.5568 6.91669 10.2178C7.60482 9.49746 8.31086 8.75974 9.08563 8.08398C10.1929 7.13654 11.4798 6.42196 12.8698 5.98438ZM16.1599 13.6699C15.6993 13.67 15.2488 13.8066 14.8659 14.0625C14.4829 14.3184 14.1848 14.6828 14.0085 15.1084C13.8323 15.5339 13.7858 16.0024 13.8757 16.4541C13.9656 16.9058 14.1877 17.3208 14.5134 17.6465C14.8391 17.9722 15.254 18.1943 15.7057 18.2842C16.1575 18.374 16.6259 18.3276 17.0515 18.1514C17.4771 17.9751 17.8414 17.676 18.0974 17.293C18.3531 16.91 18.4899 16.4595 18.4899 15.999C18.4892 15.3816 18.2428 14.7901 17.8063 14.3535C17.3697 13.9168 16.7774 13.6706 16.1599 13.6699ZM12.5036 0.425781C15.4218 -0.261001 18.4746 -0.113702 21.3132 0.850586C24.1519 1.81497 26.6633 3.55752 28.5593 5.87988C30.455 8.20207 31.6599 11.0104 32.0368 13.9844C32.0823 14.3463 31.9821 14.7118 31.7585 15C31.5348 15.2883 31.2055 15.4767 30.8434 15.5225L30.8415 15.5293C30.4795 15.5748 30.1141 15.4747 29.8259 15.251C29.5376 15.0272 29.3501 14.698 29.3044 14.3359C28.9939 11.8718 27.9966 9.54439 26.4265 7.62012C24.8563 5.69589 22.7762 4.2526 20.4245 3.4541C18.0726 2.65561 15.543 2.53396 13.1257 3.10449C10.7085 3.67506 8.50111 4.91492 6.75458 6.68066C6.49651 6.93853 6.14577 7.08301 5.78094 7.08301C5.41631 7.0829 5.06626 6.93838 4.80829 6.68066C4.55042 6.42259 4.40594 6.07186 4.40594 5.70703C4.40604 5.34235 4.55051 4.99235 4.80829 4.73438C6.91881 2.60531 9.58548 1.11264 12.5036 0.425781Z" fill="url(#ozow-logomark-gradient)"/>
            <defs>
                <linearGradient id="ozow-logomark-gradient" x1="-0.00189077" y1="-0.00322604" x2="32.0291" y2="32.0287" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#00E587"/>
                    <stop offset="1" stop-color="#00B8AD"/>
                </linearGradient>
            </defs>
        </svg>
       </template>
      </div>

      <div class="actions">
        <button class="btn-circle btn-circle--bordered" aria-label="Help" @click="openHelpModal">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.3444 15.6991C11.3444 16.4176 10.7461 17 10.0083 17C9.27043 17 8.67219 16.4176 8.67219 15.6991C8.67219 14.9806 9.27043 14.3981 10.0083 14.3981C10.7461 14.3981 11.3444 14.9806 11.3444 15.6991Z" fill="#1E2330"/>
                <path d="M6.67552 5.72515C6 6.70953 6 7.89344 6 7.89344C6 8.37243 6.39879 8.76074 6.89073 8.76074C7.38266 8.76074 7.78146 8.37243 7.78146 7.89344C7.78146 7.23571 8.15674 6.68883 8.15674 6.68883C8.53203 6.14195 9.15611 5.89025 9.15611 5.89025C9.78019 5.63855 10.4427 5.76687 10.4427 5.76687C11.1052 5.89518 11.5829 6.36027 11.5829 6.36027C12.0605 6.82535 12.1923 7.47044 12.1923 7.47044C12.3241 8.11553 12.0656 8.72319 12.0656 8.72319C11.8071 9.33085 11.2454 9.69626 11.2454 9.69626C10.6838 10.0617 10.0083 10.0617 10.0083 10.0617C9.51634 10.0617 9.11755 10.45 9.11755 10.929V11.7963C9.11755 12.2753 9.51634 12.6636 10.0083 12.6636C10.5002 12.6636 10.899 12.2753 10.899 11.7963V11.7021C11.6067 11.5474 12.2352 11.1385 12.2352 11.1385C13.2461 10.4808 13.7114 9.38699 13.7114 9.38699C14.1768 8.2932 13.9395 7.13204 13.9395 7.13204C13.7023 5.97088 12.8426 5.13373 12.8426 5.13373C11.9828 4.29658 10.7903 4.06561 10.7903 4.06561C9.59772 3.83464 8.47438 4.2877 8.47438 4.2877C7.35103 4.74076 6.67552 5.72515 6.67552 5.72515Z" fill="#1E2330"/>
             </svg>
        </button>
        <button v-if="(paymentsStore as any).cancelable || variant === 'logo'" class="btn-circle btn-circle--bordered" aria-label="Cancel" @click="userCancel">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.1831 3.93306L3.93306 15.1831C3.81585 15.3003 3.75 15.4592 3.75 15.625C3.75 15.7908 3.81585 15.9497 3.93306 16.0669C4.05027 16.1841 4.20924 16.25 4.375 16.25C4.54076 16.25 4.69973 16.1841 4.81694 16.0669L16.0669 4.81694C16.1841 4.69973 16.25 4.54076 16.25 4.375C16.25 4.20924 16.1842 4.05027 16.0669 3.93306C15.9497 3.81585 15.7908 3.75 15.625 3.75C15.4592 3.75 15.3003 3.81585 15.1831 3.93306Z" fill="#1E2330"/>
                <path d="M4.81694 3.93306C4.69973 3.81585 4.54076 3.75 4.375 3.75C4.20924 3.75 4.05027 3.81585 3.93306 3.93306C3.81585 4.05027 3.75 4.20924 3.75 4.375C3.75 4.54076 3.81585 4.69973 3.93306 4.81694L15.1831 16.0669C15.3003 16.1842 15.4592 16.25 15.625 16.25C15.7908 16.25 15.9497 16.1842 16.0669 16.0669C16.1842 15.9497 16.25 15.7908 16.25 15.625C16.25 15.4592 16.1842 15.3003 16.0669 15.1831L4.81694 3.93306Z" fill="#1E2330"/>
            </svg>
        </button>
      </div>
    </div>
    <div
      v-if="showingHelp"
      class="overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tc-title"
      @click.self="closeModal"
    >
      <div class="sheet">
        <button
          class="close"
          @click="closeModal"
          aria-label="Close dialog"
          ref="closeBtn"
        >
          ✕
        </button>

        <h2 class="mt-5">Help ?</h2>

        <h3 class="mt-6 mb-2">What is Ozow</h3>
        <p class="my-4">
            Ozow provides easy, fast and secure payment solutions for everyone. 
            With Ozow, you can make and receive payments instantly…from anywhere and at any time. 
            All you need is a bank account and a smart-enabled device. It’s that simple.
        </p>
        <hr>


        <h3 class="mt-6 mb-2">How does it work?</h3>
        <p class="">
            <ul class="mb-4">
                <li>Select your crypto wallet</li>
                <li>Follow the prompt to open your wallet app</li>
                <li>Authorise the payment though your crypto wallet app</li>
                <li>That's it. Your payment will be complete</li>
            </ul>
        </p>
        <hr>

        <h3 class="mt-6 mb-2">How long do I have to wait? </h3>
        <p class="my-4">
            You and the merchant will receive a real-time payment notification once your payment has been completed. 
            No need to send proof of payment etc.
        </p>
      </div>
    </div>
  </header>
</template>

<style scoped>
    .hero {
      position: relative;
      background: #FFFFFF;
      border-bottom: 1px solid #F1F3F6;
      box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
      border-radius: 0px 0px 20px 20px;
    }

    /* Content row (logo left, actions right) */
    .hero__content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 51px;
    }

    /* Logo group */
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 15px;
    }

    .brand__primary-logo {
      height: 32px;
      width: auto;
    }

    /* Action buttons */
    .actions {
      display: inline-flex;
      align-items: center;
      gap: 15px;
    }
    .btn-circle {
      width: 33px;
      height: 33px;
      border-radius: 999px;
      border: none;
      background: #fff;
      font-size: 13px;
      line-height: 1;
      display: grid;
      place-items: center;
      cursor: pointer;
      box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
      transition: transform .08s ease, box-shadow .08s ease;
    }
    .btn-circle:hover { transform: translateY(-1px); }
    .btn-circle--bordered {
      border: 1px solid #AFB8CD;
    }


    /* Modal */
    .overlay {
        position: fixed;
        inset: 0;
        z-index: 1000;
        /* place near the lower half like your screenshot */
        align-content: end;
        justify-items: center;
        background: rgba(17, 24, 39, 0.55);   /* dim */
        backdrop-filter: blur(2px);
    }

    /* The sheet */
    .sheet {
        width: min(720px, 100%);
        background: #fff;
        color: #1f2937;
        border-radius: 20px 20px 0px 0px;
        position: relative;
        padding: 32px 32px 24px;
        text-align: left;
        h2 {
            font-weight: 700;
            font-size: 24px;
        }
        h3 {
            font-weight: 500;
            font-size: 16px;
        }
        p, li{
            font-weight: 400;
            font-size: 14px;
            line-height: 100%;
            letter-spacing: 0%;
        }
        li {
            list-style-type: disc;
            margin-left: 20px;
        }
        hr {
            border: none;
            border: 0.5px solid #00E587;
        }
    }

    .close {
        position: absolute;
        top: 20px;
        right: 22px;
        width: 36px; height: 36px;
        border: 0; border-radius: 999px;
        background: transparent;
        font-size: 22px;
        line-height: 1;
        cursor: pointer;
    }

    .sheet__links {
        display: grid;
        gap: 14px;
        a {
            font-weight: 500;
            font-size: 14px;
            line-height: 100%;
            letter-spacing: 0%;
            text-decoration: underline;
            text-decoration-style: solid;
            text-decoration-thickness: 0%;
            color: #1E2330;
        }
    }
</style>