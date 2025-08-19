import axios from 'axios'
const host = import.meta.env.VITE_HOST
const basePath = '/services/v2'

export enum FeedbackType {
  WALLET_NOT_SUPPORTED = 'WALLET_NOT_SUPPORTED',
  ISSUE = 'ISSUE',
  SUGGESTION = 'SUGGESTION'
}

export interface FeedbackRequest {
  feedbackType: FeedbackType
  message: string
  orderId?: string
  merchantCode?: string
}

export interface FeedbackResponse {
  status: string
  message: string
  id: string
}

export class FeedbackService {
  async submitFeedback(feedback: FeedbackRequest): Promise<any> {
    const uri = `${host}${basePath}/feedback/user`
    await axios.post(
      uri,
      {
        feedback_type: feedback.feedbackType,
        message: feedback.message,
        order_id: feedback.orderId,
        merchant_code: feedback.merchantCode
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
