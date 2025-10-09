import { EVENT } from "$lib/constants";
import type { RemoteForm } from "@sveltejs/kit";
import { toast } from "svelte-sonner";

const forms = {
  close() {
    dispatchEvent(new CustomEvent(EVENT.CLOSE_FORM))
  },

  apply<T extends { message: string }>(form: RemoteForm<any, T>, options?: {
    onSuccess?(result?: T): void
    onError?(): void
  }) {
    return form.enhance(async context => {
      try {
        await context.submit()
        if (form.result?.message) {
          context.form.reset()
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