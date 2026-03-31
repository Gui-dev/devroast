export class ImageResponse {
  component: unknown
  options: { width: number; height: number }

  constructor(component: unknown, options: { width: number; height: number }) {
    this.component = component
    this.options = options
  }
}
