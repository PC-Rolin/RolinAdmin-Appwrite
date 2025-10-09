import { EVENT } from "$lib/constants";
import type { RemoteForm } from "@sveltejs/kit";
import { toast } from "svelte-sonner";

const forms = {
  close() {
    dispatchEvent(new CustomEvent(EVENT.CLOSE_FORM))
  },

  apply<T extends Record<string, any>>(form: RemoteForm<any, T> | Omit<RemoteForm<any, T>, "for">, options?: {
    onSuccess?(result: T): void
    onError?(): void
    reset?: boolean
  }) {
    return form.enhance(async context => {
      try {
        await context.submit()
        if (form.result && "message" in form.result && form.result.message) {
          if (options?.reset !== undefined) {
            if (options.reset) {
              context.form.reset()
            }
          } else {
            context.form.reset()
          }
          toast.success(form.result.message)
          options?.onSuccess?.(form.result)
          this.close()
        }
      } catch (error) {
        if (options?.onError) {
          options.onError()
        } else {
          toast.error(String(error))
        }
      }
    })
  }
}

export default forms