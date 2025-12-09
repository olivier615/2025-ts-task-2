export type CouponData = {
  id: string
  due_date: number
  is_enabled: number
  percent: number
  title: string
  code: string
}

export type Pagination = {
  total_pages: number
  current_page: number
  has_pre: boolean
  has_next: boolean
  category: string
}

export type CreateCouponParams = {
  title: string
  is_enabled: number
  percent: number
  due_date: number
  code: string
}

export type EditCouponParams = {
  id: string
  data: {
    title: string
    is_enabled: number
    percent: number
    due_date: number
    code: string
  }
}

export type GetCouponsResponse = {
  success: boolean
  coupons: CouponData[]
  pagination: Pagination
  messages: string[]
}

type MessageResponse = {
  success: boolean
  message: string
}

export type CreateCouponResponse = MessageResponse
export type EditCouponResponse = MessageResponse
export type DeleteCouponResponse = MessageResponse
