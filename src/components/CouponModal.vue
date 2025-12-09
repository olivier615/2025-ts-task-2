<script setup lang="ts">
import { apiCreateCoupon, apiEditCoupon } from '@/api/coupons'
import { useCouponForm } from '@/composable/useCouponData'

import type { CouponData, EditCouponParams } from '@/types/coupon'
import { Modal } from 'bootstrap'

import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'

interface CouponModalProps {
  // 在這裡定義 props 型別，將 unknown 替換為正確的型別
  coupon: CouponData
}

const { coupon } = defineProps<CouponModalProps>()

const emit = defineEmits(['get-coupons'])

// TODO: 為模板引用加上型別註解
// 提示：使用 useTemplateRef<HTMLElement>()
const modalRef = useTemplateRef<HTMLElement>('modalRef')

// TODO: 為 modal 變數加上型別註解
// 提示：型別是 Modal | null
let modal: Modal | null = null

onMounted(() => {
  if (modalRef.value) {
    modal = new Modal(modalRef.value)
  }
})

onUnmounted(() => {
  if (modal) {
    modal.dispose()
  }
})

const openModal = () => {
  if (modal) {
    modal.show()
  }
}

const closeModal = () => {
  if (modal) {
    modal.hide()
  }
}

const { form, formTitle, loadCoupon } = useCouponForm()

watch(
  () => coupon,
  (newCoupon) => {
    if (newCoupon.id) {
      loadCoupon(newCoupon)
    } else {
      loadCoupon(null)
    }
  },
  { immediate: true, deep: true },
)

const isEditMode = computed(() => Boolean(coupon.id))

const isLoading = ref(false)

const saveCoupon = async () => {

  const { id, ...couponData } = form.value

  const data = {
    ...couponData,
  }

  isLoading.value = true

  try {
    if (isEditMode.value && id) {
      await apiEditCoupon({ data, id })
    } else {
      await apiCreateCoupon(data)
    }
    // resetImages([])
    closeModal()
  } catch (error) {
    alert('新增/編輯產品失敗')
  } finally {
    isLoading.value = false
    emit('get-coupons')
  }
}

defineExpose({
  openModal,
  closeModal,
})
</script>

<template>
  <div
    ref="modalRef"
    class="modal fade"
    id="addNewCouponModal"
    tabindex="-1"
    aria-labelledby="addNewCouponModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content rounded-lg">
        <div class="modal-header">
          <h5 class="modal-title" id="addNewCouponModalLabel">{{ formTitle }}</h5>
          <button
            @click="closeModal"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-6">
              <form>
                <div class="mb-3">
                  <label for="couponName" class="form-label">優惠券名稱</label>
                  <input
                    v-model="form.title"
                    type="text"
                    class="form-control rounded-lg"
                    id="couponName"
                  />
                </div>
                <div class="row">
                  <div class="col-6 mb-3">
                    <label for="couponDue_date" class="form-label">期限</label>
                    <input
                      v-model="form.due_date"
                      type="number"
                      class="form-control rounded-lg"
                      id="couponDue_date"
                    />
                  </div>
                  <div class="col-6 mb-3">
                    <label for="couponPercent" class="form-label">折扣</label>
                    <input
                      v-model="form.percent"
                      type="number"
                      class="form-control rounded-lg"
                      id="couponPercent"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-6 mb-3">
                    <label for="couponCode" class="form-label">折扣碼</label>
                    <input
                      v-model="form.code"
                      class="form-control rounded-lg"
                      id="couponCode"
                    />
                  </div>
                </div>
                <div class="mb-3 d-flex align-items-center">
                  <label class="form-label me-3 mb-0">啟用</label>
                  <div class="form-check form-switch">
                    <input
                      v-model="form.is_enabled"
                      class="form-check-input"
                      type="checkbox"
                      id="flexSwitchCouponEnable"
                      :true-value="1"
                      :false-value="0"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" type="button" class="btn btn-outline-secondary rounded-lg">
            取消
          </button>
          <button
            @click="saveCoupon"
            :disabled="isLoading"
            type="button"
            class="btn btn-dark rounded-lg"
          >
            儲存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
